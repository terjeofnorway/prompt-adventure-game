import { StorySegment } from '@shared/types/Story';
import { useAppContext } from '../../context/AppContext';
import { GameState, GameTheme } from '@shared/types/GameState';
import { isValidGameState } from '@shared/helpers/typeValidators';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const useGame = () => {
  const { gameState, setGameTheme, addToStoryline, isWaiting, setIsWaiting, setFullGameState } = useAppContext();

  const sendPrompt = async (prompt: string) => {
    setIsWaiting(true);
    const response = await fetch(`${VITE_API_URL}/api/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: prompt }),
    });

    const data = (await response.json()) as StorySegment[];

    if (response.ok) {
      addToStoryline(data);
      setIsWaiting(false);
    }
  };

  const getGameState = async () => {
    const response = await fetch(`${VITE_API_URL}/api/gameState`);
    const data = await response.json();
    const gameState = data.gameState as GameState;

    if (gameState.gameTheme) {
      setFullGameState(gameState);
    }
    return gameState;
  };

  const loadGame = async () => {
    const response = await fetch(`${VITE_API_URL}/api/load`);
    const gameState = (await response.json()) as GameState;

    if (!isValidGameState(gameState)) {
      return null;
    }
    setFullGameState(gameState);
    return gameState;
  };

  const startGame = async (gameTheme: GameTheme) => {
    const response = await fetch(`${VITE_API_URL}/api/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameTheme }),
    });
    const data = await response.json();
    const gameState = data.gameState as GameState;
    setFullGameState(gameState);
    return gameState;
  };

  const restartGame = async (gameTheme: GameTheme) => {
    const response = await fetch(`${VITE_API_URL}/api/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ gameTheme }),
    });

    const gameState = (await response.json()) as GameState;
    setFullGameState(gameState);
    return gameState;
  };

  return { sendPrompt, isWaiting, gameState, startGame, loadGame, restartGame, setGameTheme, getGameState };
};
