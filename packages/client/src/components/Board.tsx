import { Prompt } from './Prompt';
import { Story } from './story/Story';
import styles from './Board.module.css';
import { Frame } from './frame/Frame';
import { useRef } from 'react';

export const Board = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  return (
    <div className={styles.board}>
      <div className={styles.content} ref={canvasRef}>
        <div className={styles.background}>
          <Story />
          <Prompt />
        </div>
      </div>
      <Frame />
    </div>
  );
};
