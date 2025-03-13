import { Request, Response } from 'express';
import { userPromptSchema } from '../schema';
import { AIMessage } from '../types';
import { progressStory } from '../gameEngine';
import { saveMessage } from '../memory/storage';

export const promptHandler = async (req: Request, res: Response) => {
  const data = req.body;

  const parsedPrompt = userPromptSchema.safeParse(data);

  if (!parsedPrompt.success) {
    console.log(data);
    res.status(400).json({ content: `The message format is not valid: ${parsedPrompt.error}` });
    return;
  }

  const userMessage: AIMessage = {
    role: 'user',
    content: parsedPrompt.data.content,
  };

  const assistantMessage = await progressStory({ message: userMessage });

  const augmentedUserMessage = await saveMessage(userMessage);
  const augmentedAssistantMessage = await saveMessage(assistantMessage);
  res.status(201).json([augmentedUserMessage, augmentedAssistantMessage]);
};
