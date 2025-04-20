import { Request, Response } from 'express';
import { newGame } from '../gameState';
import { GameTheme } from '@shared/types/GameState';
import { createBackgroundImage } from '../images';
import { isValidGameTheme } from '@shared/helpers/typeValidators';

export const restartGameHandler = async (req: Request, res: Response) => {
  // First define the GameTheme type if it doesn't exist already
  const { gameTheme } = req.body as { gameTheme: GameTheme };

  if (!isValidGameTheme(gameTheme)) {
    res.status(400).send('Invalid game theme');
    return;
  }

  const backgroundId = createBackgroundImage(gameTheme);
  const gameState = await newGame(gameTheme, backgroundId);

  res.status(200).json({
    ...gameState,
  });
};
