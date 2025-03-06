import { Request, Response } from 'express';
import { saveMessage } from './memory/storage';
import { userPromptSchema } from './schema';
import { AIMessage } from './types';
import { getFullStory, progressStory } from './gameEngine';

export const postPromptHandler = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedPrompt = userPromptSchema.safeParse(data);

  if (!parsedPrompt.success) {
    res.status(400).json({ message: 'The message format is not valid' });
    return;
  }

  const userMessage: AIMessage = {
    role: 'user',
    content: parsedPrompt.data.content,
  };

  const assistantMessage = await progressStory({ message: userMessage });

  await saveMessage(userMessage);
  await saveMessage(assistantMessage);
  res.status(201).json({ assistantMessage });
};

export const getFullStoryHandler = async (_req: Request, res: Response) => {
  const story = await getFullStory();
  res.status(200).json({ story });
};
