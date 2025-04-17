import { useEffect, useRef, useState } from 'react';
import styles from './PromptLine.module.css';

type PromptLineProps = {
  text: string;
  type: 'user' | 'computer';
  onEnter: (prompt: string) => void;
  readonly?: boolean;
};

export const PromptLine = ({ text, type, onEnter, readonly }: PromptLineProps) => {
  const [prompt, setPrompt] = useState(text);
  const [hasFocus, setHasFocus] = useState(false);
  const [caretXPos, setCaretXPos] = useState(0);
  const promptIndicator = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateCaretPosition = (characterLength: number) => {
    const inputOffsetLeft = promptIndicator.current?.getBoundingClientRect().width || 0;
    setCaretXPos(inputOffsetLeft + characterLength * 11.6 + 9);
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
    if (!readonly) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <div className={styles.promptLine}>
      {type === 'user' && (
        <div className={styles.promptIndicator} ref={promptIndicator}>
          prompt &gt;
        </div>
      )}
      {!readonly && hasFocus && <div className={styles.caret} style={{ marginLeft: `${caretXPos}px` }} />}
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={prompt}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
        readOnly={readonly}
      />
    </div>
  );
};
