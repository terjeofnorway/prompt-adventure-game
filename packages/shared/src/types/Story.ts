import { AIMessage } from '../../../server/src/types';

export type StorySegment = {
  id: string | null;
  meta?: {
    imageId?: string;
    characterDescription?: string;
  };
} & AIMessage;

export type Storyline = StorySegment[];
