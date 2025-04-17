import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  resetGame,
  setGameTheme,
  getGameTheme,
  isImageInQueue,
  addImageToQueue,
  removeImageFromQueue,
  getStoryline,
  addMessageToStoryline,
  updateMessageInStoryline,
  getBackgroundId,
  setBackgroundId,
  getSummary,
  setSummmary,
  loadGameState,
  GameState,
} from './gameState';
import { getDB } from './storage/db';
import { GameTheme } from './types';
import { StorySegment } from '@shared/types/Story';

// Mock dependencies
vi.mock('./storage/db');
vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock setTimeout to avoid waiting in tests
vi.useFakeTimers();

describe('Game State Management', () => {
  // Setup mocks before each test
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock DB implementation
    const mockDB = {
      data: null as GameState | null,
      write: vi.fn().mockResolvedValue(undefined),
    };
    (getDB as ReturnType<typeof vi.fn>).mockResolvedValue(mockDB);
  });

  describe('Game Theme', () => {
    it('should set and get game theme', () => {
      const gametheme: GameTheme = 'pirate';
      setGameTheme(gametheme);
      expect(getGameTheme()).toEqual(gametheme);
    });
  });

  describe('Image Queue', () => {
    it('should add image to queue', () => {
      const uuid = 'test-uuid';
      addImageToQueue(uuid);
      expect(isImageInQueue(uuid)).toBe(true);
    });

    it('should remove image from queue', () => {
      const uuid = 'test-uuid';
      addImageToQueue(uuid);
      removeImageFromQueue(uuid);
      expect(isImageInQueue(uuid)).toBe(false);
    });

    it('should check if image is in queue', () => {
      const uuid1 = 'test-uuid-1';
      const uuid2 = 'test-uuid-2';

      addImageToQueue(uuid1);

      expect(isImageInQueue(uuid1)).toBe(true);
      expect(isImageInQueue(uuid2)).toBe(false);
    });
  });

  describe('Storyline Management', () => {
    it('should add message to storyline', async () => {
      const message: StorySegment = {
        id: '1',
        role: 'developer',
        content: 'Test message',
      };

      await addMessageToStoryline(message);
      expect(getStoryline()).toContainEqual(message);
    });

    it('should update message in storyline', async () => {
      const message: StorySegment = {
        id: '1',
        role: 'user',
        content: 'Test message',
      };

      await addMessageToStoryline(message);

      const updatedMessage = {
        ...message,
        content: 'Updated message',
      };

      await updateMessageInStoryline(updatedMessage);
      expect(getStoryline()).toContainEqual(updatedMessage);
    });

    it('should throw error when updating non-existent message', async () => {
      const message: StorySegment = {
        id: 'non-existent',
        role: 'assistant',
        content: 'This message is not in storyline',
      };

      expect(() => updateMessageInStoryline(message)).toThrow();
    });
  });

  describe('Background Management', () => {
    it('should set and get background ID', () => {
      const id = 'bg-123';
      setBackgroundId(id);
      expect(getBackgroundId()).toBe(id);
    });
  });

  describe('Summary Management', () => {
    it('should set and get summary', () => {
      const summary = 'Game summary text';
      setSummmary(summary);
      expect(getSummary()).toBe(summary);
    });
  });

  describe('Game Reset', () => {
    it('should reset game state', async () => {
      // Setup initial state
      const gameTheme: GameTheme = 'space';
      const backgroundId = '111';
      const summary = 'Old summary';
      const message: StorySegment = { id: '1', role: 'user', content: 'Test message' };

      setGameTheme(gameTheme);
      setBackgroundId(backgroundId);
      setSummmary(summary);
      addMessageToStoryline(message);
      addImageToQueue('img-1');

      // Reset game
      const newTheme: GameTheme = 'pirate';
      const newBgId = '2';
      await resetGame(newTheme, newBgId);

      // Verify state reset
      expect(getGameTheme()).toEqual(newTheme);
      expect(getBackgroundId()).toBe(newBgId);
      expect(getStoryline()).toEqual([]);
      expect(getSummary()).toBeNull();
      expect(isImageInQueue('img-1')).toBe(false);
    });
  });

  describe('Game State Persistence', () => {
    it('should load saved game state', async () => {
      // Setup mock saved state
      const savedState: GameState = {
        backgroundId: 'saved-bg',
        summary: 'Saved summary',
        gameTheme: 'pirate',
        storyline: [{ id: 'saved-1', role: 'user', content: 'Saved content' }],
        imageQueue: ['saved-img-1'],
      };

      const mockDB = {
        data: savedState,
        write: vi.fn().mockResolvedValue(undefined),
      };
      (getDB as ReturnType<typeof vi.fn>).mockResolvedValue(mockDB);

      // Load state
      await loadGameState();

      // Verify state loaded correctly
      expect(getGameTheme()).toEqual(savedState.gameTheme);
      expect(getBackgroundId()).toBe(savedState.backgroundId);
      expect(getSummary()).toBe(savedState.summary);
      expect(getStoryline()).toEqual(savedState.storyline);
      expect(isImageInQueue('saved-img-1')).toBe(true);
    });
  });
});
