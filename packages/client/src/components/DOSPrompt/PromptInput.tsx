import { useEffect, useRef, useState } from 'react';
import styles from './PromptInput.module.css';

type PromptInputProps = {
  onEnter: (prompt: string) => void;
};

export const PromptInput = ({ onEnter }: PromptInputProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [hasFocus, setHasFocus] = useState(false);
  const [caretXPos, setCaretXPos] = useState(0);
  const promptIndicator = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputOffsetLeft = promptIndicator.current?.getBoundingClientRect().width || 0;

  const updateCaretPosition = (characterLength: number) => {
    setCaretXPos(inputOffsetLeft + characterLength * 19.2 + 11);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
    updateCaretPosition(event.target.value.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnter(prompt);
      setPrompt(''); // Clear the input after sending
      updateCaretPosition(0);
    }
  };

  useEffect(() => {
    updateCaretPosition(0);
    inputRef.current?.focus();
  }, [inputOffsetLeft]);

  return (
    <div className={styles.promptInput}>
      {hasFocus && <div className={styles.caret} style={{ marginLeft: `${caretXPos}px` }} />}
      <div className={styles.promptIndicator} ref={promptIndicator}>
        prompt &gt;
      </div>
      {
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={prompt}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      }
    </div>
  );
};
