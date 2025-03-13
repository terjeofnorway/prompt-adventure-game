import { Request, Response } from 'express';
import { getFullStory } from '../gameEngine';

export const getStorylineHandler = async (_req: Request, res: Response) => {
  const storyline = await getFullStory();
  res.status(200).json({ storyline });
};
