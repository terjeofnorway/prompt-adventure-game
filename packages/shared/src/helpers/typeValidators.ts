import { GameState, GameTheme } from '../types/GameState';
import { gameStateSchema } from '../schema/gameState';
import { availableGameThemes } from './gameState';

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

export const isValidGameTheme = (theme: string): theme is (typeof availableGameThemes)[number] => {
  return availableGameThemes.includes(theme as (typeof availableGameThemes)[number]);
};

export const isValidGameState = (gameState: unknown): gameState is GameState => {
  return gameStateSchema.safeParse(gameState).success;
};
