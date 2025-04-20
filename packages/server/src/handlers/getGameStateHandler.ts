import { Request, Response } from 'express';
import { loadGameStateFromDB } from '../gameState';

export const getGameStateHandler = async (_req: Request, res: Response) => {
  const gameState = loadGameStateFromDB();

  if (!gameState) {
    return res.status(200).json({});
  }

  return res.status(200).json({
    ...gameState,
  });
};
