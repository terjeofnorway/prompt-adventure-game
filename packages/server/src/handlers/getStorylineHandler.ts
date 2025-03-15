import { Request, Response } from 'express';
import { getFullStory } from '../gameEngine';
import { logger } from '../logger';

export const getStorylineHandler = async (_req: Request, res: Response) => {
  logger.info('Received request to get storyline');
  const storyline = await getFullStory();
  res.status(200).json({ storyline });
};
