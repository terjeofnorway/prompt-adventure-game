import styles from './Prompt.module.css';
import { useAppContext } from '../context/AppContext';

interface PromptProps {
  className?: string;
}

export const Prompt = ({ className }: PromptProps) => {
  const { prompt, setPrompt, setStory, setIsLoading } = useAppContext();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // TODO: Add your API call here
      // const response = await yourApiCall(prompt);
      // setStory(response.story);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <textarea 
        className={styles.textarea}
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button 
        className={styles.button}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
};