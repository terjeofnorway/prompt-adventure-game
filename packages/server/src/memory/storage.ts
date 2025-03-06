import { Storyline, StorySegmentType } from '@shared/types/Story';
import { AIMessage } from '../types';
import { getDB } from './db';
import { v4 as uuidv4 } from 'uuid';

export const getDeveloperPrompt = async () => {
  const db = await getDB();

  return {
    role: 'developer',
    content: db.data.developerPrompt,
  } as AIMessage;
};

export const getStoryline = async (): Promise<Storyline> => {
  const db = await getDB();
  return db.data.storyline;
};

export const saveMessage = async (message: AIMessage) => {
  const db = await getDB();

  const storySegment: StorySegmentType = {
    id: uuidv4(),
    ...message,
  };

  // Update db.json
  await db.update(({ storyline }) => storyline.push(storySegment));
};
