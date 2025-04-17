import { JSONFilePreset } from 'lowdb/node';
import { GameState } from '../gameState';

const defaultData: GameState = {
  gameTheme: null,
  backgroundId: null,
  storyline: [],
  summary: null,
  imageQueue: [],
};

export const getDB = async () => {
  const db = await JSONFilePreset<GameState>('./packages/server/db.json', defaultData);

  return db;
};
