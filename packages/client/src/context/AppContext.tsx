import { createContext, useContext, useState, ReactNode } from 'react';
import { StorySegment } from '@shared/types/Story';
import { GameState, GameTheme, LoadingState } from '@shared/types/GameState';
import { isValidGameState, isValidGameTheme } from '@shared/helpers/typeValidators';

type AppContextType = {
  setFullGameState: (gameState: GameState) => void;
  gameState: GameState | null;
  setGameTheme: (theme: GameTheme) => void;
  addToStoryline: (message: StorySegment[]) => void;
  loadingState: LoadingState;
  setBackgroundId: (backgroundId: string) => void;
  setLoadingState: (loadingState: LoadingState) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(null);

  const setFullGameState = (newGameState: GameState) => {
    if (!isValidGameState(newGameState)) {
      throw new Error(`Invalid game state: ${JSON.stringify(newGameState)}`);
    }
    setGameState({
      ...newGameState,
    });
  };

  const addToStoryline = (newSegments: StorySegment[]) => {
    if (gameState === null) {
      throw new Error('Game state is not initialized');
    }

    setGameState({
      ...gameState,
      storyline: [...gameState.storyline, ...newSegments],
    });
  };

  const setGameTheme = (theme: 'pirate' | 'space' | 'fantasy') => {
    if (gameState === null) {
      throw new Error('Game state is not initialized');
    }
    if (!isValidGameTheme(theme)) {
      throw new Error(`Invalid game theme: ${theme}`);
    }
    setGameState({ ...gameState, gameTheme: theme });
  };

  const setBackgroundId = (backgroundId: string) => {
    if (!gameState) {
      throw new Error('Game state is not initialized');
    }
    setGameState({ ...gameState, backgroundId });
  };

  return (
    <AppContext.Provider
      value={{
        setFullGameState,
        gameState,
        loadingState,
        setLoadingState,
        addToStoryline,
        setBackgroundId,
        setGameTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
