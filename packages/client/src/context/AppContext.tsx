import { createContext, useContext, useState, ReactNode } from 'react';
import { Storyline, StorySegment } from '@shared/types/Story';

interface AppContextType {
  gameTheme: 'PIRATE' | 'SPACE' | 'FANTASY' | null;
  setGameTheme: (theme: 'PIRATE' | 'SPACE' | 'FANTASY') => void;
  prompt: string;
  storyline: Storyline;
  setPrompt: (prompt: string) => void;
  setStoryline: (storyline: Storyline) => void;
  addToStoryline: (message: StorySegment[]) => void;
  isWaiting: boolean;
  setIsWaiting: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState('');
  const [storyline, setStoryline] = useState<Storyline>([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameTheme, setGameTheme] = useState<'PIRATE' | 'SPACE' | 'FANTASY' | null>(null);

  const addToStoryline = (newSegments: StorySegment[]) => {
    setStoryline((prev) => [...prev, ...newSegments]);
  };

  return (
    <AppContext.Provider
      value={{
        gameTheme,
        prompt,
        setPrompt,
        storyline,
        setStoryline,
        setGameTheme,
        addToStoryline,
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
