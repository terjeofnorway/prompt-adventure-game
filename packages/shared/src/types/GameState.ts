import { StorySegment } from './Story';

export type GameTheme = 'pirate' | 'space' | 'fantasy';

export type GameState = {
  backgroundId: string | null;
  summary: string | null;
  gameTheme: GameTheme | null;
  storyline: StorySegment[];
  imageQueue: string[];
};
