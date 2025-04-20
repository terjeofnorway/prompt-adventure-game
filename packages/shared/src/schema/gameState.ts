import { z } from 'zod';

export const gameStateSchema = z.object({
  gameTheme: z.enum(['pirate', 'space', 'fantasy']).optional(),
  storyline: z.array(
    z.object({
      id: z.string(),
      meta: z
        .object({
          imageId: z.string().optional(),
          characterDescription: z.string().optional(),
          isSummarized: z.boolean().optional(),
        })
        .optional(),
    })
  ),
  backgroundId: z.string().optional(),
});
