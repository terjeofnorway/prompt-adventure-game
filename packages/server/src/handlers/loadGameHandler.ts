import { Request, Response } from 'express';
import { loadGameState } from '../gameState';

export const loadGameHandler = async (_req: Request, res: Response) => {
  const gameState = loadGameState();

  if (!gameState) {
    return res.status(200).json({});
  }

  return res.status(200).json({
    ...gameState,
  });
};
