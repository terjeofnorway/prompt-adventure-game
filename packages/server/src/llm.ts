import { Message } from './types';
import { zodResponseFormat } from 'openai/helpers/zod';
import OpenAI from 'openai';
import dotenv from 'dotenv';

import { getSystemPrompt } from './memory/storage';
import { llmResponseSchema } from './schema';

dotenv.config();

type ProgressStoryParams = {
  messages: Message[];
  includeCharacter?: boolean;
};

type imagePromptParams = {
  message: Message;
};

export const connectToLLM = async () => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openai;
};

const responseFormat = zodResponseFormat(llmResponseSchema, 'assistant_response');

const imageSystemPromptPrefix =
  'The theme is pirate game. Create a medium resolution pixel-art image inspired by 90s adventure games such as Monkey Island, Kings Quest or Space Quest. Use a restricted 64-color palette: ';

const newCharacterPrompt =
  'Introduce a new character to the story. Create a short description of the character and their appearance, including clothing and accessories.';

const createCharacterPrompt = (): Message => {
  console.log('Creating character prompt');
  return {
    role: 'system',
    content: newCharacterPrompt,
  };
};

export const postMessageToLLM = async ({ messages, includeCharacter = false }: ProgressStoryParams) => {
  const systemPrompt = await getSystemPrompt();

  const openai = await connectToLLM();

  const llmMessageThread = [systemPrompt, ...messages];

  if (includeCharacter) {
    llmMessageThread.push(createCharacterPrompt());
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: llmMessageThread,
    response_format: responseFormat,
  });

  return response.choices[0].message;
};

export const postImagePromptToLLM = async ({ message }: imagePromptParams) => {
  const systemPrompt = await getSystemPrompt();
  const fullPrompt = `${systemPrompt}: ${imageSystemPromptPrefix} ${message.content}`;

  console.log('fullPrompt', fullPrompt);

  const openai = await connectToLLM();

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: fullPrompt,
    n: 1,
    size: '1024x1024',
  });

  console.log('response', response);
};
