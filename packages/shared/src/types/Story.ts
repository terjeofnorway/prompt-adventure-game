import { AIMessage } from '../../../server/src/types';

export type StorySegment = {
  id: string;
  meta?: {
    imageId?: string;
    situationDescription?: string;
    isSummarized?: boolean;
  };
} & AIMessage;

export type UserPrompt = Omit<StorySegment, 'id' | 'meta'>;

export type Storyline = StorySegment[];

export type Theme = 'pirate' | 'space' | 'fantasy';
