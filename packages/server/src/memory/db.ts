import { StorySegment } from '@shared/types/Story';
import { JSONFilePreset } from 'lowdb/node';
import { GameTheme } from '../types';

type DatabaseSchema = {
  gameTheme: GameTheme | null;
  backgroundId: string | null;
  storyline: StorySegment[];
  gameInstructionPrompt: string;
  summary: string;
};

const defaultData: DatabaseSchema = {
  gameTheme: null,
  backgroundId: null,
  storyline: [],
  gameInstructionPrompt: '',
  summary: '',
};

export const getDB = async () => {
  const db = await JSONFilePreset<DatabaseSchema>('./packages/server/db.json', defaultData);

  return db;
};
