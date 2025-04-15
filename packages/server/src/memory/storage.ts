import { Storyline, StorySegment } from '@shared/types/Story';
import { AIMessage, GameTheme } from '../types';
import { getDB } from './db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Reset game and set game theme
 */
export const resetGame = async (gameTheme: GameTheme, backgroundId: string) => {
  const db = await getDB();
  db.data.gameTheme = gameTheme;
  db.data.backgroundId = backgroundId;
  db.data.storyline = [];
  db.data.summary = '';
  db.data.gameInstructionPrompt = '';
  await db.write();
};

/**
 * Retrieves the current game progress summary from the database.
 */
export const getSummary = async (): Promise<string> => {
  const db = await getDB();
  return db.data.summary;
};

/**
 * Saves a new summary to the database.
 */
export const saveSummary = async (summary: string) => {
  const db = await getDB();
  db.data.summary = summary;
  await db.write();
};

/**
 * Retrieves the current storyline (sequence of story segments) from the database.
 */
export const getStoryline = async (): Promise<Storyline> => {
  const db = await getDB();
  return db.data.storyline;
};

/**
 * Saves game instruction message to the database.
 * Only saves the message if the content is a string.
 */
export const saveGameInstructionPrompt = async (message: AIMessage) => {
  if (typeof message.content !== 'string') {
    return;
  }

  const db = await getDB();
  db.data.gameInstructionPrompt = message.content;
  await db.write();
};

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
