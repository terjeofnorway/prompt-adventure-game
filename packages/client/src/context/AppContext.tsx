import { createContext, useContext, useState, ReactNode } from 'react';
import { Storyline, StorySegment } from '@shared/types/Story';
import { GameState } from '@shared/types/GameState';
import { availableGameThemes, defaultGameState } from '@shared/helpers/gameState';

interface AppContextType {
  setFullGameState: (newGameState: GameState) => void;
  gameState: GameState;
  setGameTheme: (theme: 'pirate' | 'space' | 'fantasy') => void;
  addToStoryline: (message: StorySegment[]) => void;
  isWaiting: boolean;
  setBackgroundId: (backgroundId: string) => void;
  setIsWaiting: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [isWaiting, setIsWaiting] = useState(false);

  const setFullGameState = (newGameState: GameState) => {
    setGameState({
      ...newGameState,
    });
  };

  const addToStoryline = (newSegments: StorySegment[]) => {
    setGameState((prev) => ({
      ...prev,
      storyline: [...prev.storyline, ...newSegments],
    }));
  };

  const setGameTheme = (theme: 'pirate' | 'space' | 'fantasy') => {
    if (!availableGameThemes.includes(theme)) {
      throw new Error(`Invalid game theme: ${theme}`);
    }
    setGameState((prev) => ({ ...prev, gameTheme: theme }));
  };

  const setBackgroundId = (backgroundId: string) => {
    setGameState((prev) => ({ ...prev, backgroundId }));
  };

  return (
    <AppContext.Provider
      value={{
        setFullGameState,
        gameState,
        addToStoryline,
        setBackgroundId,
        setGameTheme,
        isWaiting,
        setIsWaiting,
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
