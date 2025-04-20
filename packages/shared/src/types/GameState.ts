import { StorySegment } from './Story';

export type GameTheme = 'pirate' | 'space' | 'fantasy';

export type GameState = {
  backgroundId: string;
  summary: string;
  gameTheme: GameTheme;
  storyline: StorySegment[];
  imageQueue: string[];
};
