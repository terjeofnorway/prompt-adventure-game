import { fileURLToPath } from 'url';
import path from 'path';
import { StorySegment } from '@shared/types/Story';
import { AIMessage } from './types';

// Create __dirname equivalent for ES modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const toAIMessage = (message: StorySegment): AIMessage => {
  const content = message.content || '';

  const aiMessage: AIMessage = {
    role: message.role,
    content,
  } as AIMessage;

  return aiMessage;
};

/**
 * Type guard to check if a message is a StorySegment or an AIMessage
 * StorySegment has an 'id' property and optionally a 'meta' property
 */
export const isStorySegment = (message: StorySegment | AIMessage): message is StorySegment => {
  return 'id' in message;
};

/**
 * Type guard to check if a message is an AIMessage (not a StorySegment)
 */
export const isAIMessage = (message: StorySegment | AIMessage): message is AIMessage => {
  return !('id' in message);
};
