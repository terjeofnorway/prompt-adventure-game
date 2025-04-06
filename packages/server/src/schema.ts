import { z } from 'zod';

export const userPromptSchema = z.object({
  content: z.string(),
});

export const assistantResponseSchema = z.object({
  content: z.string(),
  role: z.enum(['assistant']),
});

export const llmResponseSchema = z.object({
  story: z.string().describe('This is the actual story segment that is presented as text to the user.'),
  characterDescription: z
    .string()
    .describe(
      'This is a description of the character or object that is included in the story segment. Give a short summary of the relevant details, how the character looks like to help the user immerse themselves into the story visually.'
    ),
});
