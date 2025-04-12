import { fileURLToPath } from 'url';
import path from 'path';
import { StorySegment } from '@shared/types/Story';
import { AIMessage } from './types';

// Create __dirname equivalent for ES modules
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const stripStorySegmentForLLM = (storySegment: StorySegment): AIMessage => {
  return {
    content: storySegment.content ?? '',
    role: storySegment.role,
  } as AIMessage;
};
