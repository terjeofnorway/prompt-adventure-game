import styles from './Story.module.css';
import { useAppContext } from '../context/AppContext';

interface StoryProps {
  className?: string;
}

export const Story = ({ className }: StoryProps) => {
  const { story } = useAppContext();

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.content}>{story}</div>
    </div>
  );
};
