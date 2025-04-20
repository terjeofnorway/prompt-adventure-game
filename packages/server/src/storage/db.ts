import { GameState } from '@shared/types/GameState';
import { JSONFilePreset } from 'lowdb/node';

export const getDB = async () => {
  return await JSONFilePreset<GameState | null>('./packages/server/db.json', null);
};
