import styles from './Story.module.css';
import { useAppContext } from '../../context/AppContext';
import { StorySegment } from './StorySegment';
import { Loader } from './Loader';

export const Story = () => {
  const { storyline } = useAppContext();

  console.log(storyline);

  return (
    <div className={`${styles.story}`}>
      <div className={styles.content}>
        {storyline.map((storySegment) => (
          <StorySegment key={storySegment.id} storySegment={storySegment} />
        ))}
        <Loader />
      </div>
    </div>
  );
};
