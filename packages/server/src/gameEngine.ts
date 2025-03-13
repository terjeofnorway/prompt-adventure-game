import { gameInstructionPrompt, newCharacterPrompt, startPrompt } from './defaults';
import { postCharacterPromptToLLM, postMessageToLLM } from './llm';
import { getStoryline } from './memory/storage';
import { AIMessage } from './types';

type ProgressStoryParams = {
  message: AIMessage;
};

type StoryContent = {
  story: string;
  characterDescription: string;
};

const normalizeAssistantStoryContent = (message: AIMessage) => {
  if (typeof message.content !== 'string') {
    return message;
  }

  const { story, characterDescription } = JSON.parse(message.content) as StoryContent;

  console.log(`Story: ${characterDescription}`);

  return {
    ...message,
    content: story,
  };
};

export const startStory = async (messages: AIMessage[]) => {
  const response = await postMessageToLLM({ messages });
  const normalizedResponse = normalizeAssistantStoryContent(response);
  return normalizedResponse;
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
};

export const buildNewCharacter = async (): Promise<AIMessage> => {
  const characterResponse = await postCharacterPromptToLLM(newCharacterPrompt);
  return {
    role: 'developer',
    content: `If the users prompt is accepted and the story moves on, introduce a new character in the next story segment: ${characterResponse}`,
  };
};

export const progressStory = async ({ message }: ProgressStoryParams): Promise<AIMessage> => {
  const storyline = await getStoryline();

  const shouldIntroduceCharacter = Math.random() < 0.3;
  const newCharacterMessage = shouldIntroduceCharacter ? await buildNewCharacter() : null;

  if (newCharacterMessage !== null) {
    console.log(`Introduced new character: ${newCharacterMessage.content}`);
  }

  const messages = [...storyline, newCharacterMessage, message].filter((m) => m !== null);
  const response = await postMessageToLLM({ messages });

  if (response.content === null) {
    return response;
  }

  const normalizedResponse = normalizeAssistantStoryContent(response);
  return normalizedResponse;
};

export const getFullStory = async () => {
  const storyline = await getStoryline();
  return storyline;
};
