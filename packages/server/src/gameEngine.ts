import { v4 as uuidv4 } from 'uuid';
import { gameInstructionPrompt, imagegameInstructionPromptPrefix, newCharacterPrompt, startPrompt } from './defaults';
import { postCharacterPromptToLLM, postImagePromptToLLM, postMessageToLLM } from './llm';
import { getStoryline } from './memory/storage';
import { AIMessage } from './types';
import { StorySegment } from '@shared/types/Story';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ProgressStoryParams = {
  message: AIMessage;
};

type StoryContent = {
  story: string;
  characterDescription: string;
};

const normalizeAssistantStoryContent = (message: AIMessage) => {
  if (typeof message.content !== 'string') {
    throw new Error('Invalid message content');
  }

  const { story, characterDescription } = JSON.parse(message.content) as StoryContent;

  return {
    message: {
      ...message,
      content: story,
    },
    characterDescription,
  };
};

const createAndStoreImage = (characterDescription: string) => {
  const imagePrompt = `${imagegameInstructionPromptPrefix}: ${characterDescription}`;
  const uuid = uuidv4();
  postImagePromptToLLM(imagePrompt).then((response) => {
    const { data } = response;
    if (!Array.isArray(data)) {
      throw new Error('Invalid image data');
    }
    const imageData = data[0];
    const { url } = imageData;

    // Fetch the image and store it locally
    const imagePath = path.join(__dirname, '../', 'assets', `${uuid}.png`);
    const writer = fs.createWriteStream(imagePath);
    axios({
      url,
      method: 'GET',
      responseType: 'stream',
    }).then((imageResponse) => {
      imageResponse.data.pipe(writer);
    });
  });
  return uuid;
};

const buildNewCharacter = async (): Promise<AIMessage> => {
  const characterResponse = await postCharacterPromptToLLM(newCharacterPrompt);
  const characterDescription = characterResponse.content;
  if (typeof characterDescription !== 'string') {
    throw new Error('Invalid character description');
  }
  return {
    role: 'developer',
    content: `If the users prompt is accepted and the story moves on, introduce a new character in the next story segment: ${characterDescription}`,
  };
};

export const buildGameInstructionMessage = async () => {
  return {
    role: 'developer',
    content: gameInstructionPrompt,
  } as AIMessage;
};

export const buildStartMessage = (): AIMessage => {
  return {
    role: 'developer',
    content: startPrompt,
  };
  ('');
};

export const startStory = async (messages: AIMessage[]): Promise<StorySegment> => {
  const response = await postMessageToLLM({ messages });
  const { message, characterDescription } = normalizeAssistantStoryContent(response);
  if (message.content === null) {
    throw new Error('Invalid response from LLM');
  }
  const imageId = createAndStoreImage(characterDescription);
  const { content, role } = message;
  return { role, content, id: uuidv4(), meta: { imageId, characterDescription } };
};

export const progressStory = async ({ message }: ProgressStoryParams): Promise<StorySegment> => {
  const storyline = await getStoryline();

  const shouldIntroduceCharacter = Math.random() < 0.3;
  const newCharacterMessage = shouldIntroduceCharacter ? await buildNewCharacter() : null;

  if (newCharacterMessage !== null) {
    console.log(`Introduced new character: ${newCharacterMessage.content}`);
  }

  const messages = [...storyline, newCharacterMessage, message].filter((m) => m !== null);
  const response = await postMessageToLLM({ messages });

  const { message: normalizedMessage, characterDescription } = normalizeAssistantStoryContent(response);

  if (normalizedMessage.content === null) {
    throw new Error('Invalid response from LLM');
  }

  const imageId = createAndStoreImage(characterDescription);
  const { content, role } = normalizedMessage;
  return { role, content, id: uuidv4(), meta: { imageId, characterDescription } };
};

export const getFullStory = async () => {
  const storyline = await getStoryline();
  return storyline;
};
