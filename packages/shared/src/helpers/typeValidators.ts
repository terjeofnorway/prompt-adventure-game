import { GameState, GameTheme } from '../types/GameState';
import { gameStateSchema } from '../schema/gameState';

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};
export const isArray = <T>(value: unknown): value is T[] => {
  return Array.isArray(value);
};

export const isValidGameTheme = (gameTheme: unknown): gameTheme is GameTheme => {
  return typeof gameTheme === 'string' && (gameTheme === 'pirate' || gameTheme === 'space' || gameTheme === 'fantasy');
};

export const isValidGameState = (gameState: unknown): gameState is GameState => {
  return gameStateSchema.safeParse(gameState).success;
};
