import { Request, Response } from 'express';
import { summmarizeStory } from '../gameEngine';
import { logger } from '../logger';

export const summarizeStoryHandler = async (_req: Request, res: Response) => {
  logger.info('Received request to get storyline');
  const summary = await summmarizeStory();
  res.status(200).json({ summary });
};
