import { StorySegment } from '@shared/types/Story';
import { JSONFilePreset } from 'lowdb/node';

type DatabaseSchema = { storyline: StorySegment[]; gameInstructionPrompt: string; summary: string };

const defaultData: DatabaseSchema = { storyline: [], gameInstructionPrompt: '', summary: '' };

export const getDB = async () => {
  const db = await JSONFilePreset<DatabaseSchema>('./packages/server/db.json', defaultData);

  return db;
};
