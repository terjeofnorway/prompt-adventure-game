import { useState } from 'react';
import styles from './PromptLine.module.css';

type PromptLineProps = {
  text: string;
  type: 'user' | 'computer';
  onEnter: (prompt: string) => void;
  readonly?: boolean;
};

export const PromptLine = ({ text, type, onEnter, readonly }: PromptLineProps) => {
  const [prompt, setPrompt] = useState(text);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter(prompt);
      setPrompt(''); // Clear the input after sending
    }
  };

  return (
    <div className={styles.promptLine}>
      {type === 'user' && <div className={styles.promptIndicator}>prompt &gt;</div>}
      <input
        type="text"
        className={styles.input}
        value={prompt}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        readOnly={readonly}
      />
    </div>
  );
};
