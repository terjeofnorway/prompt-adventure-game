import { v4 as uuidv4 } from 'uuid';
import { gameInstructionPrompt, startPrompt, summaryStartPrompt } from './defaults';
import { postMessageToLLM } from './llm';
import { getStoryline, getSummary, updateMessage } from './memory/storage';
import { AIMessage, RawUserMessage } from './types';
import { StorySegment } from '@shared/types/Story';
import { __dirname, stripStorySegmentForLLM } from './helpers';
import { createAndStoreImage } from './images';

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

export const buildGameInstructionMessage = async () => {
  return {
    role: 'developer',
    content: gameInstructionPrompt,
  } as StorySegment;
};

export const buildSummaryInstructionMessage = async (currentSummary: string): Promise<AIMessage> => {
  const summaryPrompt = currentSummary
    ? `${summaryStartPrompt}. The following has already happened and should be included in the summary: ${currentSummary}`
    : `${summaryStartPrompt}`;

  return {
    role: 'developer',
    content: summaryPrompt,
  };
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

export const summmarizeStory = async (): Promise<string> => {
  console.log('Summarizing story');
  const storyline = await getStoryline();
  const currentSummary = await getSummary();

  const instructionPrompt = !currentSummary
    ? summaryStartPrompt
    : `${summaryStartPrompt}. The following has already happened and should be included in the summary: ${currentSummary}`;

  const storySegmentsAsString = storyline.reduce((acc, segment) => {
    if (segment.role === 'developer' || segment.meta?.isSummarized) {
      return acc;
    }

    const storyteller = segment.role === 'user' ? 'User' : 'Assistant';

    return `${acc}\n${storyteller}: ${segment.content}`;
  }, '');

  const llmMessage: StorySegment = {
    id: uuidv4(),
    role: 'developer',
    content: `${instructionPrompt}${storySegmentsAsString}`,
  };

  const response = await postMessageToLLM({ messages: [llmMessage] });

  const { message } = destructAIMessageResponse(response);

  console.log('Summary message:', message);

  // Replace forEach with Promise.all + map to properly await all async operations
  /* await Promise.all(
    unsummarizedMessages.map(async (message) => {
      message.meta = { ...message.meta, isSummarized: true };
      await updateMessage(message);
    })
  );

  console.log('got here');

  return message.content as string; 
  */

  return message.content as string;
};

export const getFullStory = async () => {
  const storyline = await getStoryline();
  return storyline;
};
