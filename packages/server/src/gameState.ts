import { GameTheme } from '@shared/types/GameState';
import { StorySegment } from '@shared/types/Story';
import { __dirname } from './helpers';
import { getDB } from './storage/db';
import { logger } from './logger';

const gameState: GameState = {
  imageQueue: [],
  gameTheme: null,
  summary: null,
  backgroundId: null,
  storyline: [],
};

const saveGameState = async (initialWait: boolean) => {
  if (!initialWait) {
    logger.info('Saving game state...');
    const db = await getDB();
    db.data = gameState;
    await db.write();
  }

  setTimeout(() => saveGameState(false), 10000);
};

export const loadGameState = async () => {
  const db = await getDB();
  const savedGameState = db.data;

  if (!savedGameState || !savedGameState.gameTheme) {
    return null;
  }

  if (savedGameState) {
    gameState.gameTheme = savedGameState.gameTheme;
    gameState.backgroundId = savedGameState.backgroundId;
    gameState.storyline = savedGameState.storyline;
    gameState.summary = savedGameState.summary;
    gameState.imageQueue = savedGameState.imageQueue;
  }
  saveGameState(true);
  return savedGameState;
};

export const resetGame = async (gameTheme: GameTheme, backgroundId: string) => {
  gameState.imageQueue = [];
  gameState.gameTheme = gameTheme;
  gameState.backgroundId = backgroundId;
  gameState.storyline = [];
  gameState.summary = null;

  saveGameState(false);
  return gameState;
};

export const setGameTheme = (theme: GameTheme) => {
  gameState.gameTheme = theme;
};

export const getGameTheme = () => {
  return gameState.gameTheme;
};

export const isImageInQueue = (uuid: string) => {
  return gameState.imageQueue.find((id) => id === uuid) !== undefined;
};

export const addImageToQueue = (uuid: string) => {
  gameState.imageQueue.push(uuid);
};

export const removeImageFromQueue = (uuid: string) => {
  gameState.imageQueue = gameState.imageQueue.filter((id) => id !== uuid);
};

export const getStoryline = () => {
  return gameState.storyline;
};

export const addMessageToStoryline = (message: StorySegment) => {
  gameState.storyline.push(message);
};

export const updateMessageInStoryline = (message: StorySegment) => {
  const index = gameState.storyline.findIndex((msg) => msg.id === message.id);
  if (index === -1) {
    throw new Error(`Message with id ${message.id} not found in storyline`);
  }
  gameState.storyline[index] = { ...message };
};

export const getBackgroundId = () => {
  return gameState.backgroundId;
};

export const setBackgroundId = (id: string) => {
  gameState.backgroundId = id;
};

export const getSummary = () => {
  return gameState.summary;
};

export const setSummmary = (summary: string) => {
  gameState.summary = summary;
};
