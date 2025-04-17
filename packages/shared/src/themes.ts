import { Theme } from './types/Story';

export const availableGameThemes: Theme[] = ['pirate', 'space', 'fantasy'] as const;

export const isThemeValid = (theme: string): theme is (typeof availableGameThemes)[number] => {
  return availableGameThemes.includes(theme as (typeof availableGameThemes)[number]);
};
