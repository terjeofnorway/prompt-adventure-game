import { Theme } from './types/Story';

export const availableThemes: Theme[] = ['pirate', 'space', 'fantasy'] as const;

export const isThemeValid = (theme: string): theme is (typeof availableThemes)[number] => {
  return availableThemes.includes(theme as (typeof availableThemes)[number]);
};
