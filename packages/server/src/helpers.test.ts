import { describe, it, expect } from 'vitest';
import { toAIMessage, __dirname, __filename } from './helpers';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorySegment } from '@shared/types/Story';

describe('helpers', () => {
  describe('toAIMessage', () => {
    it('should return an AIMessage with content and role from StorySegment', () => {
      const storySegment: StorySegment = {
        id: '1',
        content: 'Test content',
        role: 'user',
      };

      const result = toAIMessage(storySegment);

      expect(result).toEqual({
        content: 'Test content',
        role: 'user',
      });
    });

    it('should use empty string for content if it is null or undefined', () => {
      // @ts-expect-error
      const storySegment: StorySegment = {
        id: '1',
        content: null,
        role: 'user',
      };

      const result = toAIMessage(storySegment);

      expect(result).toEqual({
        content: '',
        role: 'user',
      });
    });
  });

  describe('__filename and __dirname', () => {
    it('should have correct __filename value', () => {
      const expectedFilename = fileURLToPath(import.meta.url).replace('.test.ts', '.ts');
      expect(expectedFilename).toContain('helpers.ts');
    });

    it('should have correct __dirname value', () => {
      const expectedDirname = path.dirname(fileURLToPath(import.meta.url));
      expect(__dirname).toBe(expectedDirname);
    });
  });
});
