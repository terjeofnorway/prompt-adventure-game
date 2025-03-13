import { Storyline, StorySegment } from '@shared/types/Story';
import { AIMessage } from '../types';
import { getDB } from './db';
import { v4 as uuidv4 } from 'uuid';

export const getStoryline = async (): Promise<Storyline> => {
  const db = await getDB();
  return db.data.storyline;
};

export const saveGameInstructionMessage = async (message: AIMessage) => {
  if (typeof message.content !== 'string') {
    return;
  }

  const db = await getDB();
  db.data.gameInstructionPrompt = message.content;
  await db.write();
};

export const saveMessage = async (message: AIMessage) => {
  const db = await getDB();

  const storySegment: StorySegment = {
    id: uuidv4(),
    ...message,
  };

  // Update db.json
  await db.update(({ storyline }) => storyline.push(storySegment));

  return storySegment;
};
