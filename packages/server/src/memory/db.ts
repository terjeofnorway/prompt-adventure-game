import { JSONFilePreset } from 'lowdb/node';
import { StorySegment } from '../types';

type DatabaseSchema = { storyline: StorySegment[]; developerPrompt: string; summary: string };

const defaultData: DatabaseSchema = { storyline: [], developerPrompt: '', summary: '' };

export const getDB = async () => {
  const db = await JSONFilePreset<DatabaseSchema>('./packages/server/db.json', defaultData);

  return db;
};
