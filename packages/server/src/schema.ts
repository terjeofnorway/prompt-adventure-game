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
      'This is a visual description of the situation being told in the story segment. Give a short summary of the relevant details, how any characters looks or how the surrounding looks. This is to help the user immerse themselves into the story visually.'
    ),
});
