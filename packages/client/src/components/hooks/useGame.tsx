import { useAppContext } from '../../context/AppContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const useGame = () => {
  const { prompt, setPrompt, storyline, setStoryline, isLoading, setIsLoading } = useAppContext();

  const sendPrompt = async (prompt: string) => {
    const response = await fetch(`${VITE_API_URL}/api/prompt`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    return response;
  };

  const getStoryline = async () => {
    const response = await fetch(`${VITE_API_URL}/api/storyline`);
    const data = await response.json();

    if (data.storyline) {
      setStoryline(data.storyline);
    }
  };

  return { sendPrompt, getStoryline, storyline };
};
