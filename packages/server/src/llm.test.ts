import { describe, it, expect, beforeEach, vi } from 'vitest';
import { connectToLLM, sendMessagesToLLM, generateImage } from './llm';
import { StorySegment } from '@shared/types/Story';
import { buildGameInstructionMessage } from './gameEngine';
import { AIMessage } from './types';
import { toAIMessage } from './helpers';

// foo.test.ts

// Mock external modules
vi.mock('openai', () => {
  const mockCreate = vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          role: 'assistant',
          content: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
        },
      },
    ],
  });

  const mockGenerateImage = vi.fn().mockResolvedValue({
    data: [
      {
        url: 'https://example.com/image.jpg',
        revised_prompt: 'Revised prompt',
      },
    ],
  });

  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
      images: {
        generate: mockGenerateImage,
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

describe('LLM Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('connectToLLM', () => {
    it('should create an OpenAI instance', async () => {
      const OpenAI = (await import('openai')).default;
      const result = await connectToLLM();

      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: process.env.OPENAI_API_KEY,
      });
      expect(result).toBeDefined();
    });
  });

  describe('sanitizeMessage', () => {
    it('should be true', () => {
      expect(true).toBe(true);
    });
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

      const expected: AIMessage = {
        role: 'user',
        content: 'Test message',
      };

      const result = toAIMessage(storySegment);
      expect(result).toEqual(expected);
    });
  });

  describe('postMessageToLLM', () => {
    it('should post messages to LLM and return a response', async () => {
      const messages: StorySegment[] = [
        {
          role: 'user',
          content: 'Test message',
          id: '123',
        },
      ];

      const openaiInstance = await connectToLLM();
      const result = await sendMessagesToLLM({ messages });

      expect(buildGameInstructionMessage).toHaveBeenCalled();
      expect(openaiInstance.chat.completions.create).toHaveBeenCalled();

      expect(result).toEqual({
        role: 'assistant',
        content: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
      });
    });
  });

  describe('postImagePromptToLLM', () => {
    it('should generate an image based on a character description', async () => {
      const situationDescription = 'A brave knight with a sword';
      const openaiInstance = await connectToLLM();
      const result = await generateImage({ imagePrompt: situationDescription, context: 'situation' });

      expect(openaiInstance.images.generate).toHaveBeenCalled();

      expect(result).toEqual({
        data: [
          {
            url: 'https://example.com/image.jpg',
            revised_prompt: 'Revised prompt',
          },
        ],
      });
    });
  });
});
