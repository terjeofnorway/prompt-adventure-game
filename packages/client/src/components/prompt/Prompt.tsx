import styles from './Prompt.module.css';
import { useAppContext } from '../../context/AppContext';
import { useGame } from '../hooks/useGame';

export const Prompt = () => {
  const { prompt, setPrompt } = useAppContext();
  const { sendPrompt } = useGame();

  const handleSubmit = async () => {
    window.dispatchEvent(new Event('USER_PROMPT'));
    sendPrompt(prompt);
    setPrompt('');
    
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
