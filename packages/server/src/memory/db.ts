import { LowSync } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import { Message } from '../types';

type DatabaseSchema = { storyline: Message[]; systemPrompt: string; summary: string };

const defaultData: DatabaseSchema = { storyline: [], systemPrompt: '', summary: '' };

export const getDB = async () => {
  const db = await JSONFilePreset<DatabaseSchema>('./packages/server/db.json', defaultData);

  return db;
};
