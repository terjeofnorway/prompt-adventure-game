import { AIMessage, ImageSize } from './types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { zodResponseFormat } from 'openai/helpers/zod';

import { buildGameInstructionMessage } from './gameEngine';
import { llmResponseSchema } from './schema';
import { StorySegment } from '@shared/types/Story';
import { logger } from './logger';
import { toAIMessage } from './helpers';

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
export const prepareLLMMessageThread = async (messages: StorySegment[]): Promise<AIMessage[]> => {
  const gameInstructionPrompt = await buildGameInstructionMessage();
  return [gameInstructionPrompt, ...messages].map(toAIMessage).filter((item): item is AIMessage => !!item);
};

/**
 * Sends a conversation thread to the LLM and retrieves a response
 */
export const sendMessagesToLLM = async ({ messages }: { messages: StorySegment[] }) => {
  const openai = await connectToLLM();

  const llmMessageThread = await prepareLLMMessageThread(messages);

  logger.info(`Sending LLM message request`);
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: llmMessageThread,
    response_format: zodResponseFormat(llmResponseSchema, 'llmResponse'),
  });

  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices in LLM response');
  }

  return response.choices[0].message;
};

/**
 * Generates an image based on a character description using DALL-E
 */
export const generateImage = async ({ imagePrompt, size }: { imagePrompt: string; size: ImageSize }) => {
  const openai = await connectToLLM();

  const sizeDictionary = {
    small: '256x256',
    medium: '512x512',
    large: '1024x1024',
    xlarge: '1792x1024',
  };

  const imageSize = sizeDictionary[size] as OpenAI.ImageGenerateParams['size'];

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    n: 1,
    size: imageSize,
  });

  return response;
};
