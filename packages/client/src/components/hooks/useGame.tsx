import { StorySegment } from '@shared/types/Story';
import { useAppContext } from '../../context/AppContext';
import { GameState, GameTheme } from '@shared/types/GameState';
import { isValidGameState } from '@shared/helpers/typeValidators';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const useGame = () => {
  const { gameState, setGameTheme, addToStoryline, loadingState, setLoadingState, setFullGameState } = useAppContext();

  const sendPrompt = async (prompt: string) => {
    setLoadingState('loading_prompt');
    const response = await fetch(`${VITE_API_URL}/api/prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: prompt }),
    });

    console.log('Response:', response);

    const data = (await response.json()) as StorySegment[];

    if (response.ok) {
      addToStoryline(data);
      setLoadingState(null);
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

  const startConversation = async () => {
    setLoadingState('loading_prompt');
    const response = await fetch(`${VITE_API_URL}/api/startConversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = (await response.json()) as StorySegment[];

    if (response.ok) {
      addToStoryline(data);
      setLoadingState(null);
    }
  };

  const loadGame = async () => {
    setLoadingState('loading_game');
    const response = await fetch(`${VITE_API_URL}/api/load`);
    const gameState = (await response.json()) as GameState;

    if (!isValidGameState(gameState)) {
      return null;
    }
    setFullGameState(gameState);
    return gameState;
  };

  const startGame = async (gameTheme: GameTheme, restart?: boolean) => {
    setLoadingState('loading_game');
    const endpoint = restart ? '/api/restart' : '/api/start';
    const response = await fetch(`${VITE_API_URL}${endpoint}`, {
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

  return { sendPrompt, loadingState, gameState, startGame, loadGame, setGameTheme, getGameState };
};
