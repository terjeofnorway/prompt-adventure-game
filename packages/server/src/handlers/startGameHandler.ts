import { Request, Response } from 'express';
import { GameTheme } from '../types';
import { createBackgroundImage } from '../images';
import { getGameTheme, loadGameState, resetGame } from '../gameState';

export const startGameHandler = async (req: Request, res: Response) => {
  // First define the GameTheme type if it doesn't exist already
  const { gameTheme } = req.body as { gameTheme: GameTheme };

  console.log(gameTheme);

  const currentGameTheme = getGameTheme();

  // If there is already a game theme going.
  const gameState = loadGameState();
  if (currentGameTheme === gameTheme && gameState) {
    res.status(200).json({
      ...gameState,
    });

    return;
  }

  const backgroundId = createBackgroundImage(gameTheme);
  const newGame = resetGame(gameTheme, backgroundId);

  res.status(200).json({
    ...newGame,
  });
};
