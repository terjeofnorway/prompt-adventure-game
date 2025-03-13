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
      'This is a description of the character that is included in the story segment, but leave blank if no character was included or mentioned. If a character was included or mentioned, describe the characters appearance, personality, and any other relevant visual details.'
    ),
});
