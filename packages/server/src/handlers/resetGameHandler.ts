import { Request, Response } from 'express';
import { __dirname } from '../helpers';
import { loadGameState } from '../gameEngine';
import { resetGame } from '../storage/storage';
import { GameTheme } from '../types';
import { createBackgroundImage } from '../images';
import { gameState } from '../gameEngine';

const availableGameThemes = ['pirate', 'space', 'fantasy'];

export const resetGameHandler = async (req: Request, res: Response) => {
  // First define the GameTheme type if it doesn't exist already
  const { gameTheme } = req.body as { gameTheme: GameTheme };
  console.log(req.body);

  if (!gameTheme || !availableGameThemes.includes(gameTheme)) {
    res.status(400).send('Invalid game theme');
    return;
  }
  const backgroundId = createBackgroundImage(gameTheme);

  await resetGame(gameTheme, backgroundId);
  await loadGameState();

  res.status(200).json({
    message: 'Game reset successfully',
    gameTheme: gameState.gameTheme,
    backgroundId,
  });
};
