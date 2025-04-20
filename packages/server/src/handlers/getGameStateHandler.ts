import { Request, Response } from 'express';
import { getGameState, loadGameStateFromDB } from '../gameState';
import { isValidGameState } from '@shared/helpers/typeValidators';

export const getGameStateHandler = async (_req: Request, res: Response) => {
  // Attempt gameState from memory
  let gameState = getGameState();

  if (!gameState) {
    gameState = await loadGameStateFromDB();
  }

  // No saved gameState found (Hasn't been started yet)
  if (!isValidGameState(gameState)) {
    return res.status(200).json({});
  }

  return res.status(200).json({
    ...gameState,
  });
};
