import styles from './Story.module.css';
import { useAppContext } from '../context/AppContext';

interface StoryProps {
  className?: string;
}

export const Story = ({ className }: StoryProps) => {
  const { story, isLoading } = useAppContext();

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.content}>
        {isLoading ? 'Generating story...' : story || 'Your story will appear here...'}
      </div>
    </div>
  );
};