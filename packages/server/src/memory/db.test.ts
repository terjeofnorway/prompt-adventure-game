import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDB } from './db';
import * as lowdbNode from 'lowdb/node';

// Mock the JSONFilePreset function from lowdb/node
vi.mock('lowdb/node', () => {
  return {
    JSONFilePreset: vi.fn(),
  };
});

describe('Database', () => {
  const mockDB = {
    data: {
      storyline: [],
      gameInstructionPrompt: '',
      summary: '',
    },
    read: vi.fn(),
    write: vi.fn(),
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup the mock to return our mockDB
    (lowdbNode.JSONFilePreset as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockDB);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('getDB should call JSONFilePreset with correct parameters', async () => {
    await getDB();
    expect(lowdbNode.JSONFilePreset).toHaveBeenCalledWith('./packages/server/db.json', {
      storyline: [],
      gameInstructionPrompt: '',
      summary: '',
    });
    expect(lowdbNode.JSONFilePreset).toHaveBeenCalledTimes(1);
  });

  test('getDB should return the database instance', async () => {
    const db = await getDB();

    expect(db).toEqual(mockDB);
  });
});
