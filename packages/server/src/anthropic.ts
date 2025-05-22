import { OpenAIMessage, ImageContext } from './types';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

import { buildGameInstructionMessage } from './gameEngine';
import { characterCreationSchema, llmResponseSchema } from './schema';
import { StorySegment } from '@shared/types/Story';
import { logger } from './logger';
import { isStorySegment, toAIMessage } from './helpers';
import { gameInstructionPrompt, getThemePrompt } from './prompts';
import { GameTheme } from '@shared/types/GameState';

// Load environment variables from .env file
dotenv.config();

/**
 * Initializes and returns an Anthropic client using the API key from environment variables
 */
export const connectToAnthropic = async () => {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  return anthropic;
};

/**
 * Prepares a message thread for the LLM by adding initial developer instruction prompt and converting
 * story segments to the AI message format
 */
export const prepareAnthropicMessageThread = async (
  messages: StorySegment[] | OpenAIMessage[]
): Promise<OpenAIMessage[]> => {
  const aiMessages = messages.map((message) => {
    // Convert StorySegment to AIMessage if needed, otherwise use as is
    return isStorySegment(message) ? toAIMessage(message) : message;
  });

  return [...aiMessages].filter((item): item is OpenAIMessage => !!item);
};

/**
 * Sends a conversation thread to the Anthropic Claude model and retrieves a response
 */
export const sendMessagesToAnthropic = async ({ messages }: { messages: StorySegment[] | OpenAIMessage[] }) => {
  const anthropic = await connectToAnthropic();

  const llmMessageThread = await prepareAnthropicMessageThread(messages);

  logger.info(`Anthropic message thread: ${JSON.stringify(llmMessageThread, null, 2)}`);

  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    system: gameInstructionPrompt,
    messages: llmMessageThread.map((msg) => ({
      role: msg.role === 'developer' ? 'user' : msg.role,
      content: msg.content,
    })),
  });

  if (!response.content || response.content.length === 0) {
    throw new Error('No content in Anthropic response');
  }

  console.log(response.content[0]);

  return {
    role: 'assistant',
    content: response.content[0].text,
  };
};

/**
 * Creates a character for the game with detailed attributes using the Anthropic Claude model
 * This is used at the beginning of the game to establish the player character
 */
export const createCharacterWithAnthropic = async ({ gameTheme }: { gameTheme: GameTheme }) => {
  const anthropic = await connectToAnthropic();

  const themeDescription = getThemePrompt(gameTheme);

  const characterPrompt = [
    {
      role: 'user',
      content: `You are a character creation assistant for an adventure game. ${themeDescription} Create a detailed protagonist character appropriate for the game theme provided.
      
      Create a character for a ${gameTheme}-themed adventure game.
      The character should be interesting and have unique characteristics that fit the theme. 
      Provide a detailed visual description that could be used to generate an image of the character.`,
    },
  ];

  logger.info(`Creating character for ${gameTheme} theme using Anthropic`);
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1024,
    messages: characterPrompt,
  });

  if (!response.content || response.content.length === 0) {
    throw new Error('No content in Anthropic character creation response');
  }

  logger.info(`Character created: ${JSON.stringify(response.content[0].text, null, 2)}`);
  return {
    role: 'assistant',
    content: response.content[0].text,
  };
};
