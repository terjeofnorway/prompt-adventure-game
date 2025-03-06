import { AIMessage } from '../../../server/src/types';

export type StorySegment = {
  id: string;
} & AIMessage;

export type Storyline = StorySegment[];
