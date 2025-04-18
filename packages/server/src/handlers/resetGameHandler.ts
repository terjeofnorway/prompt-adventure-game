import { Request, Response } from 'express';
import { __dirname } from '../helpers';
import { loadGameState, resetGame } from '../gameState';
import { GameTheme } from '@shared/types/GameState';
import { createBackgroundImage } from '../images';
import { availableGameThemes } from '@shared/themes';

export const resetGameHandler = async (req: Request, res: Response) => {
  // First define the GameTheme type if it doesn't exist already
  const { gameTheme } = req.body as { gameTheme: GameTheme };

  if (!gameTheme || !availableGameThemes.includes(gameTheme)) {
    res.status(400).send('Invalid game theme');
    return;
  }
  const backgroundId = createBackgroundImage(gameTheme);

  await resetGame(gameTheme, backgroundId);
  const gameState = await loadGameState();

  res.status(200).json({
    ...gameState,
  });
};
