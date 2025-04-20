import { GameState, GameTheme } from '@shared/types/GameState';
import { StorySegment } from '@shared/types/Story';
import { getDB } from './storage/db';
import { logger } from './logger';
import { isValidGameState } from '@shared/helpers/typeValidators';

let gameState: GameState | null = null;

const saveGameStateToDB = async (initialWait: boolean) => {
  if (!isValidGameState(gameState)) {
    return;
  }

  if (!initialWait) {
    logger.info('Saving game state...');
    const db = await getDB();
    db.data = gameState;
    await db.write();
  }

  setTimeout(() => saveGameStateToDB(false), 10000);
};

// Must be a standard function declaration, not an arrow function, to be used as an assertion function.
// Typescript assert functions doesn't cope well when written as arrow functions.
function assertGameStateInitializedOrThrow(state: GameState | null): asserts state is GameState {
  if (!isValidGameState(state)) {
    throw new Error('Invalid game state');
  }
}

export const loadGameStateFromDB = async () => {
  const db = await getDB();
  const loadedGameState = db.data;

  if (!isValidGameState(loadedGameState)) {
    logger.error('Invalid game state loaded from DB or no game state found');
    return null;
  }

  if (loadedGameState) {
    gameState = {
      ...loadedGameState,
    };
  }
  return loadedGameState;
};

export const resetGame = async (gameTheme: GameTheme, backgroundId: string) => {
  gameState = {
    imageQueue: [],
    gameTheme: gameTheme,
    backgroundId: backgroundId,
    storyline: [],
    summary: '',
  };

  saveGameStateToDB(false);
  return gameState;
};

export const setGameTheme = (theme: GameTheme) => {
  assertGameStateInitializedOrThrow(gameState);
  gameState.gameTheme = theme;
};

export const getGameTheme = () => {
  assertGameStateInitializedOrThrow(gameState);
  return gameState.gameTheme;
};

export const isImageInQueue = (uuid: string) => {
  assertGameStateInitializedOrThrow(gameState);
  return gameState.imageQueue.find((id) => id === uuid) !== undefined;
};

export const addImageToQueue = (uuid: string) => {
  assertGameStateInitializedOrThrow(gameState);
  gameState.imageQueue.push(uuid);
};

export const removeImageFromQueue = (uuid: string) => {
  assertGameStateInitializedOrThrow(gameState);
  if (!gameState.imageQueue) {
    gameState.imageQueue = [];
  }
  gameState.imageQueue = gameState.imageQueue.filter((id) => id !== uuid);
};

export const getStoryline = () => {
  assertGameStateInitializedOrThrow(gameState);
  return gameState.storyline;
};

export const addMessageToStoryline = (message: StorySegment) => {
  assertGameStateInitializedOrThrow(gameState);
  gameState.storyline.push(message);
};

export const updateMessageInStoryline = (message: StorySegment) => {
  assertGameStateInitializedOrThrow(gameState);
  const index = gameState.storyline.findIndex((msg) => msg.id === message.id);
  if (index === -1) {
    throw new Error(`Message with id ${message.id} not found in storyline`);
  }
  gameState.storyline[index] = { ...message };
};

export const getBackgroundId = () => {
  assertGameStateInitializedOrThrow(gameState);
  return gameState.backgroundId;
};

export const setBackgroundId = (id: string) => {
  assertGameStateInitializedOrThrow(gameState);
  gameState.backgroundId = id;
};

export const getSummary = () => {
  assertGameStateInitializedOrThrow(gameState);
  return gameState.summary;
};

export const setSummmary = (summary: string) => {
  assertGameStateInitializedOrThrow(gameState);
  gameState.summary = summary;
};
