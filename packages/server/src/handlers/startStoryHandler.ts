import { Request, Response } from 'express';
import { saveGameInstructionMessage, saveMessage } from '../memory/storage';
import { buildGameInstructionMessage, buildStartMessage, getFullStory, startStory } from '../gameEngine';

export const startStoryHandler = async (_req: Request, res: Response) => {
  const gameInstructionMessage = await buildGameInstructionMessage();
  const startMessage = buildStartMessage();

  const assistantMessage = await startStory([gameInstructionMessage, startMessage]);

  await saveGameInstructionMessage(gameInstructionMessage);
  await saveMessage(startMessage);
  await saveMessage(assistantMessage);

  const storyline = await getFullStory();

  res.status(200).json({ storyline });
};
