import { v4 as uuidv4 } from 'uuid';
import { gameInstructionPrompt, imagegameInstructionPromptPrefix, startPrompt } from './defaults';
import { postImagePromptToLLM, postMessageToLLM } from './llm';
import { getStoryline } from './memory/storage';
import { AIMessage, RawUserMessage } from './types';
import { StorySegment } from '@shared/types/Story';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { logger } from './logger';
import { __dirname } from './helpers';

type GameState = {
  waitingImages: string[];
};

export const gameState: GameState = {
  waitingImages: [],
};

type StoryContent = {
  story: string;
  characterDescription: string;
};

const destructAIMessageResponse = (message: AIMessage): { message: StorySegment; characterDescription: string } => {
  if (typeof message.content !== 'string') {
    throw new Error('Invalid message content');
  }

  const { story, characterDescription } = JSON.parse(message.content) as StoryContent;

  return {
    message: {
      ...message,
      id: uuidv4(),
      content: story,
    },
    characterDescription,
  };
};

const createAndStoreImage = (characterDescription: string) => {
  const imagePrompt = `${imagegameInstructionPromptPrefix}: ${characterDescription}`;
  const uuid = uuidv4();
  gameState.waitingImages.push(uuid);
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
      writer.on('finish', () => {
        logger.info(`Image saved to ${imagePath}`);
        gameState.waitingImages = gameState.waitingImages.filter((id) => id !== uuid);
      });
    });
  });
  return uuid;
};

export const buildGameInstructionMessage = async () => {
  return {
    role: 'developer',
    content: gameInstructionPrompt,
  } as StorySegment;
};

export const buildStartMessage = (): StorySegment => {
  return {
    id: uuidv4(),
    role: 'developer',
    content: startPrompt,
  };
};

export const startStory = async (messages: StorySegment[]): Promise<StorySegment> => {
  const response = await postMessageToLLM({ messages });
  const { message, characterDescription } = destructAIMessageResponse(response);

  if (!message.content || typeof message.content !== 'string') {
    throw new Error('Invalid response from LLM');
  }

  const imageId = characterDescription && createAndStoreImage(characterDescription);
  return { ...message, meta: { imageId, characterDescription } };
};

export const progressStory = async (rawUserMessage: RawUserMessage): Promise<StorySegment> => {
  const storyline = await getStoryline();
  const newMessage: StorySegment = {
    ...rawUserMessage,
    id: uuidv4(),
  };

  const allMessages = [...storyline, newMessage].filter((m) => m !== null);
  const response = await postMessageToLLM({ messages: allMessages });

  const { message, characterDescription } = destructAIMessageResponse(response);

  if (message.content === null || typeof message.content !== 'string') {
    throw new Error('Invalid response from LLM');
  }

  // Note that this is not an async function. We want to deliver
  // the message to the client as soon as possible, and then
  // store the image in the background. The client will poll on the image
  // id and load it when it's ready.
  const imageId = characterDescription && createAndStoreImage(characterDescription);

  return { ...message, meta: { imageId, characterDescription } };
};

export const getFullStory = async () => {
  const storyline = await getStoryline();
  return storyline;
};
