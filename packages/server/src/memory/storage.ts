import { Message } from '../types';
import { getDB } from './db';

export const getSystemPrompt = async () => {
  const db = await getDB();

  return {
    role: 'system',
    content: db.data.systemPrompt,
  } as Message;
};

export const getStoryline = async () => {
  const db = await getDB();
  return db.data.storyline;
};

export const saveMessage = async (message: Message) => {
  const db = await getDB();

  // Update db.json
  await db.update(({ storyline }) => storyline.push(message));
};
