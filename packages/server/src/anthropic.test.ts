import { describe, it, expect, beforeEach, vi } from 'vitest';
import { connectToAnthropic, sendMessagesToAnthropic, createCharacterWithAnthropic } from './anthropic';
import { StorySegment } from '@shared/types/Story';
import { buildGameInstructionMessage } from './gameEngine';
import { OpenAIMessage } from './types';
import { toAIMessage } from './helpers';

// Mock external modules
vi.mock('@anthropic-ai/sdk', () => {
  const mockCreate = vi.fn().mockResolvedValue({
    content: [
      {
        text: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
      },
    ],
  });

  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: mockCreate,
      },
    })),
  };
});

vi.mock('./gameEngine', () => ({
  buildGameInstructionMessage: vi.fn().mockResolvedValue({
    role: 'system',
    content: 'Test game instruction',
  }),
}));

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn(),
  },
  config: vi.fn(),
}));

vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
  },
}));

describe('Anthropic Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('connectToAnthropic', () => {
    it('should create an Anthropic instance', async () => {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const result = await connectToAnthropic();

      expect(Anthropic).toHaveBeenCalledWith({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      expect(result).toBeDefined();
    });
  });

  describe('sanitizeMessage', () => {
    it('should sanitize a StorySegment into an AIMessage', () => {
      const storySegment: StorySegment = {
        role: 'user',
        content: 'Test message',
        id: '123',
        meta: {
          situationDescription: 'Test scene description',
          imageId: '456',
          isSummarized: false,
        },
      };

      const expected: OpenAIMessage = {
        role: 'user',
        content: 'Test message',
      };

      const result = toAIMessage(storySegment);
      expect(result).toEqual(expected);
    });
  });

  describe('sendMessagesToAnthropic', () => {
    it('should post messages to Anthropic and return a response', async () => {
      const messages: StorySegment[] = [
        {
          role: 'user',
          content: 'Test message',
          id: '123',
        },
      ];

      const anthropicInstance = await connectToAnthropic();
      const result = await sendMessagesToAnthropic({ messages });

      expect(buildGameInstructionMessage).toHaveBeenCalled();
      expect(anthropicInstance.messages.create).toHaveBeenCalled();

      expect(result).toEqual({
        role: 'assistant',
        content: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
      });
    });
  });

  describe('createCharacterWithAnthropic', () => {
    it('should create a character using Anthropic', async () => {
      const gameTheme = 'fantasy';
      const anthropicInstance = await connectToAnthropic();
      const result = await createCharacterWithAnthropic({ gameTheme });

      expect(anthropicInstance.messages.create).toHaveBeenCalled();
      expect(result).toEqual({
        role: 'assistant',
        content: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
      });
    });
  });
});
