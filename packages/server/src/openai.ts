import { OpenAIMessage, ImageContext } from './types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { zodResponseFormat } from 'openai/helpers/zod';

import { buildGameInstructionMessage } from './gameEngine';
import { characterCreationSchema, llmResponseSchema } from './schema';
import { StorySegment } from '@shared/types/Story';
import { logger } from './logger';
import { isStorySegment, toAIMessage } from './helpers';
import { getThemePrompt } from './prompts';
import { GameTheme } from '@shared/types/GameState';

// Load environment variables from .env file
dotenv.config();

/**
 * Initializes and returns an OpenAI client using the API key from environment variables
 */
export const connectToLLM = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai;
};

/**
 * Prepares a message thread for the LLM by adding initial developer instruction prompt and converting
 * story segments to the AI message format
 */
export const prepareLLMMessageThread = async (messages: StorySegment[] | OpenAIMessage[]): Promise<OpenAIMessage[]> => {
  const gameInstructionPrompt = await buildGameInstructionMessage();

  const aiMessages = messages.map((message) => {
    // Convert StorySegment to AIMessage if needed, otherwise use as is
    return isStorySegment(message) ? toAIMessage(message) : message;
  });

  return [gameInstructionPrompt, ...aiMessages].filter((item): item is OpenAIMessage => !!item);
};

/**
 * Sends a conversation thread to the LLM and retrieves a response
 */
export const sendMessagesToLLM = async ({ messages }: { messages: StorySegment[] | OpenAIMessage[] }) => {
  const openai = await connectToLLM();

  const llmMessageThread = await prepareLLMMessageThread(messages);

  logger.info(`LLM message thread: ${JSON.stringify(llmMessageThread, null, 2)}`);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: llmMessageThread,
    response_format: zodResponseFormat(llmResponseSchema, 'llmResponse'),
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices in LLM response');
  }

  console.log(response.choices[0].message);

  return response.choices[0].message;
};

/**
 * Creates a character for the game with detailed attributes using the LLM
 * This is used at the beginning of the game to establish the player character
 */
export const createCharacter = async ({ gameTheme }: { gameTheme: GameTheme }) => {
  const openai = await connectToLLM();

  const themeDescription = getThemePrompt(gameTheme);

  const characterPrompt: OpenAIMessage[] = [
    {
      role: 'developer',
      content: `You are a character creation assistant for an adventure game. ${themeDescription} Create a detailed protagonist character appropriate for the game theme provided.`,
    },
    {
      role: 'user',
      content: `Create a character for a ${gameTheme}-themed adventure game
      The character should be interesting and have unique characteristics that fit the theme. 
      Provide a detailed visual description that could be used to generate an image of the character.`,
    },
  ];

  logger.info(`Creating character for ${gameTheme} theme`);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: characterPrompt,
    response_format: zodResponseFormat(characterCreationSchema, 'characterCreation'),
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices in LLM character creation response');
  }

  logger.info(`Character created: ${JSON.stringify(response.choices[0].message.content, null, 2)}`);
  return response.choices[0].message;
};

/**
 * Generates an image based on a character description using DALL-E
 */
export const generateImage = async ({ imagePrompt, context }: { imagePrompt: string; context: ImageContext }) => {
  const openai = await connectToLLM();

  const imageSize = context === 'situation' ? '1024x1024' : '1792x1024';

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    n: 1,
    size: imageSize,
  });

  return response;
};
