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
  situationDescription: z
    .string()
    .describe(
      'This is a visual description of what is happening in the story segment. Give a short summary of the relevant details or any characters if any.'
    ),
});

export const characterCreationSchema = z.object({
  name: z.string().describe("The character's full name"),
  gender: z.string().describe("The character's gender (male, female, non-binary etc.)"),
  pronouns: z.string().describe("The character's chosen pronouns (e.g., he/him, she/her, they/them)"),
  outfit: z.array(z.string().describe('keywords describing the outfit')),
  hair: z.string().describe("Brief description of the character's hair style, length, and color"),
  accessories: z.array(z.string()).describe('Any notable accessories like jewelry, weapons, or other items'),
  personality: z.string().describe("Brief description of the character's personality traits"),
  background: z.string().describe('Short backstory or relevant background information'),
  visualDescription: z
    .string()
    .describe(
      'A complete visual description for generating an image of the character. Must be consistent with the other attributes in this description.'
    ),
});
