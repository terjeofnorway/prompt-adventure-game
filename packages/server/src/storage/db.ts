import { GameState } from '@shared/types/GameState';
import { JSONFilePreset } from 'lowdb/node';

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
