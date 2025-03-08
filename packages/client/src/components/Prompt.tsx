import styles from './Prompt.module.css';
import { useAppContext } from '../context/AppContext';

export const Prompt = () => {
  const { prompt, setPrompt, setIsLoading } = useAppContext();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
  };

  return (
    <div className={`${styles.prompt}`}>
      <textarea
        className={styles.textarea}
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button className={styles.button} onClick={handleSubmit}>
        Send
      </button>
    </div>
  );
};
