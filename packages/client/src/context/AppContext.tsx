import { createContext, useContext, useState, ReactNode } from 'react';
import { Storyline } from '@shared/types/Story';

interface AppContextType {
  prompt: string;
  storyline: Storyline;
  setPrompt: (prompt: string) => void;
  setStoryline: (storyline: Storyline) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState('');
  const [storyline, setStoryline] = useState<Storyline>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        prompt,
        setPrompt,
        storyline,
        setStoryline,
        isLoading,
        setIsLoading,
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
