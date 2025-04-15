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
