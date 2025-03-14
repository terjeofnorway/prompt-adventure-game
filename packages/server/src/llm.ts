import { AIMessage } from './types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { zodResponseFormat } from 'openai/helpers/zod';

import { imagegameInstructionPromptPrefix } from './defaults';
import { buildGameInstructionMessage } from './gameEngine';
import { llmResponseSchema } from './schema';

dotenv.config();

type ProgressStoryParams = {
  messages: AIMessage[];
};

export const connectToLLM = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai;
};

export const postMessageToLLM = async ({ messages }: ProgressStoryParams) => {
  const gameInstructionPrompt = await buildGameInstructionMessage();

  const openai = await connectToLLM();

  const llmMessageThread = [gameInstructionPrompt, ...messages];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: llmMessageThread,
    response_format: zodResponseFormat(llmResponseSchema, 'llmResponse'),
  });

  return response.choices[0].message;
};

export const postCharacterPromptToLLM = async (characterPrompt: string) => {
  const openai = await connectToLLM();

  const message: AIMessage = {
    role: 'developer',
    content: characterPrompt,
  };

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [message],
  });

  return response.choices[0].message;
};

export const postImagePromptToLLM = async (characterDescription: string) => {
  const imagePrompt = `${imagegameInstructionPromptPrefix} ${characterDescription}`;

  const openai = await connectToLLM();

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: imagePrompt,
    n: 1,
    size: '1024x1024',
  });

  return response;
};
