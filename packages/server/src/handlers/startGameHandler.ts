import { Request, Response } from 'express';
import { GameTheme } from '@shared/types/GameState';
import { createBackgroundImage } from '../images';
import { getGameTheme, loadGameStateFromDB, newGame } from '../gameState';
import { isValidGameState, isValidGameTheme } from '@shared/helpers/typeValidators';
import { logger } from '../logger';

export const startGameHandler = async (req: Request, res: Response) => {
  // First define the GameTheme type if it doesn't exist already
  const { gameTheme } = req.body as { gameTheme: GameTheme };

  const currentGameState = await loadGameStateFromDB();

  if (!isValidGameTheme(gameTheme)) {
    logger.error('Start game: Invalid game theme:', gameTheme);
    res.status(400).json({
      error: 'Invalid game theme',
    });
    return;
  }

  if (isValidGameState(currentGameState)) {
    logger.info('Start game: Already has a valid game state:', currentGameState);
    const currentGameTheme = getGameTheme();

    // If there is already a game theme going.
    if (currentGameTheme === gameTheme) {
      res.status(200).json({
        ...currentGameState,
      });

      return;
    }
  }

  const backgroundId = createBackgroundImage(gameTheme);
  const gameState = await newGame(gameTheme, backgroundId);

  res.status(200).json({
    ...gameState,
  });
};
