import { Prompt } from './Prompt';
import { Story } from './Story';
import styles from './Board.module.css';
import { useState } from 'react';
import { Frame } from './frame/Frame';

export const Board = () => {
  const [isDragging, setIsDragging] = useState(false);

  const boardStyle = {
    '--knob-primary-color': isDragging ? '#6A6A6A' : '#4A4A4A',
    '--knob-secondary-color': isDragging ? '#3A3A3A' : '#2A2A2A',
  } as React.CSSProperties;

  return (
    <div
      className={styles.board}
      style={boardStyle}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      <div className={styles.content}>
        <Story className={styles.story} />
        <Prompt className={styles.prompt} />
        <Frame />
      </div>
    </div>
  );
};
