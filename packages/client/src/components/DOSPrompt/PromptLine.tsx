import styles from './PromptLine.module.css';

type PromptLineProps = {
  text: string;
  type: 'user' | 'computer';
};

export const PromptLine = ({ text, type }: PromptLineProps) => {
  return <div className={styles.promptLine}>{<div className={styles[type]}>{text}</div>}</div>;
};
