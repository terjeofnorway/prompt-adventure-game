import { StorySegment } from '@shared/types/Story';
import { useAppContext } from '../../context/AppContext';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const useGame = () => {
  const { storyline, setStoryline, addToStoryline, isWaiting, setIsWaiting } = useAppContext();

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

  const getStoryline = async () => {
    const response = await fetch(`${VITE_API_URL}/api/storyline`);
    const data = await response.json();

    if (data.storyline) {
      setStoryline(data.storyline);
    }
  };

  return { sendPrompt, getStoryline, storyline, isWaiting };
};
