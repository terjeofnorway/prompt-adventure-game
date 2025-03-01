import { Request, Response } from 'express';
import { saveMessage } from './memory/storage';
import { userPromptSchema } from './schema';
import { Message } from './types';
import { progressStory } from './gameEngine';

export const postPromptHandler = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedPrompt = userPromptSchema.safeParse(data);

  if (!parsedPrompt.success) {
    res.status(400).json({ message: 'The message format is not valid' });
    return;
  }

  const userMessage: Message = {
    role: 'user',
    content: parsedPrompt.data.content,
  };

  const assistantMessage = await progressStory({ message: userMessage });

  await saveMessage(userMessage);
  await saveMessage(assistantMessage);
  res.status(201).json({ assistantMessage });
};
