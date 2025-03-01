import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  prompt: string;
  story: string;
  setPrompt: (prompt: string) => void;
  setStory: (story: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prompt, setPrompt] = useState('');
  const [story, setStory] = useState('Your story will appear here...');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider
      value={{
        prompt,
        setPrompt,
        story,
        setStory,
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
