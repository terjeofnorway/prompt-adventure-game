import { useAppContext } from '../../context/AppContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const useGame = () => {
  const { prompt, setPrompt, story, setStory, isLoading, setIsLoading } = useAppContext();

  const sendPrompt = async (prompt: string) => {
    const response = await fetch(`${VITE_API_URL}/api/prompt`, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    return response;
  };

  const getFullStory = async () => {
    const response = await fetch(`${VITE_API_URL}/api/story`);
    const data = await response.json();

    if (data.story) {
      setStory(data.story);
    }
  };

  return { sendPrompt, getFullStory, story };
};
