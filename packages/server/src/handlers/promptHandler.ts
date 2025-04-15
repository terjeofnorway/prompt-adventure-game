import { Request, Response } from 'express';
import { userPromptSchema } from '../schema';
import { RawUserMessage } from '../types';
import { progressStory } from '../gameEngine';
import { addMessage } from '../memory/storage';

export const promptHandler = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedPrompt = userPromptSchema.safeParse(data);

  if (!parsedPrompt.success) {
    console.log(data);
    res.status(400).json({ content: `The message format is not valid: ${parsedPrompt.error}` });
    return;
  }

  const userMessage: RawUserMessage = {
    role: 'user',
    content: parsedPrompt.data.content,
  };

  const assistantMessage = await progressStory(userMessage);

  const augmentedUserMessage = await addMessage(userMessage);
  const augmentedAssistantMessage = await addMessage(assistantMessage);
  res.status(201).json([augmentedUserMessage, augmentedAssistantMessage]);
};
