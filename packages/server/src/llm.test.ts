import { describe, it, expect, beforeEach, vi } from 'vitest';
import { connectToLLM, sanitizeMessage, postMessageToLLM, postImagePromptToLLM } from './llm';
import { StorySegment } from '@shared/types/Story';
import { buildGameInstructionMessage } from './gameEngine';
import { AIMessage } from './types';

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
          characterDescription: 'Test character description',
          imageId: '456',
          isSummarized: false,
        },
      };

      const expected: AIMessage = {
        role: 'user',
        content: 'Test message',
      };

      const result = sanitizeMessage(storySegment);
      expect(result).toEqual(expected);
    });
  });

  describe('postMessageToLLM', () => {
    describe('should be true', () => {
      it('should be true', () => {
        expect(true).toBe(true);
      });
    });

    it('should post messages to LLM and return a response', async () => {
      const messages: StorySegment[] = [
        {
          role: 'user',
          content: 'Test message',
          id: '123',
        },
      ];

      const openaiInstance = await connectToLLM();
      const result = await postMessageToLLM({ messages });

      expect(buildGameInstructionMessage).toHaveBeenCalled();
      expect(openaiInstance.chat.completions.create).toHaveBeenCalledWith({
        model: 'gpt-4o-mini',
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: 'Test game instruction',
          }),
          expect.objectContaining({
            role: 'user',
            content: 'Test message',
          }),
        ]),
        response_format: expect.any(Object),
      });

      expect(result).toEqual({
        role: 'assistant',
        content: '{"llmResponse":{"text":"Test response","options":["Option 1","Option 2"]}}',
      });
    });
  });

  describe('postImagePromptToLLM', () => {
    it('should generate an image based on a character description', async () => {
      const characterDescription = 'A brave knight with a sword';
      const openaiInstance = await connectToLLM();
      const result = await postImagePromptToLLM(characterDescription);

      expect(openaiInstance.images.generate).toHaveBeenCalledWith({
        model: 'dall-e-3',
        prompt: expect.stringContaining(characterDescription),
        n: 1,
        size: '1024x1024',
      });

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
