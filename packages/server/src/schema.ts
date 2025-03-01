import { z } from 'zod';

export const userPromptSchema = z.object({
  content: z.string(),
});

export const assistantResponseSchema = z.object({
  content: z.string(),
  role: z.enum(['assistant']),
});

export const llmResponseSchema = z.object({
  story: z
    .string()
    .describe(
      'This is the text that the assistant has created that drives the story forward. Aim for max 150 words, but less is also acceptable.'
    ),
  character: z
    .string()
    .describe(
      'If previous system prompt asks for character description: create a short description of the character and their appearance, including clothing and accessories.'
    ),
});
