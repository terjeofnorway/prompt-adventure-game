import { StorySegment } from '@shared/types/Story';
import { AIMessage } from '../types';
import { getDB } from './db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Reset game and set game theme
 */

/**
 * Updates an existing story segment in the storyline.
 */
export const updateMessage = async (message: StorySegment) => {
  const db = await getDB();
  const storyline = db.data.storyline;
  const index = storyline.findIndex((msg) => msg.id === message.id);
  if (index === -1) {
    throw new Error(`Message with id ${message.id} not found in storyline`);
  }
  if (index !== -1) {
    storyline[index] = { ...message };
    await db.write();
  }
};

/**
 * Adds a new AI message to the storyline with a generated UUID.
 */
export const addMessage = async (message: AIMessage) => {
  const db = await getDB();

  const storySegment: StorySegment = {
    id: uuidv4(),
    ...message,
  };

  // Update db.json
  await db.update(({ storyline }) => storyline.push(storySegment));

  return storySegment;
};
