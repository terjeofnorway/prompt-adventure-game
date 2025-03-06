import styles from './Story.module.css';
import { useAppContext } from '../../context/AppContext';
import { StorySegment } from './StorySegment';

interface StoryProps {
  className?: string;
}

export const Story = ({ className }: StoryProps) => {
  const { storyline } = useAppContext();

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.content}>
        {storyline.map((storySegment) => (
          <StorySegment key={storySegment.id} storySegment={storySegment} />
        ))}
      </div>
    </div>
  );
};
