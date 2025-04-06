import { AIMessage } from '../../../server/src/types';

export type StorySegment = {
  id: string;
  meta?: {
    imageId?: string;
    characterDescription?: string;
  };
} & AIMessage;

export type UserPrompt = Omit<StorySegment, 'id' | 'meta'>;

export type Storyline = StorySegment[];
