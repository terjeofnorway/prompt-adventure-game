import styles from './Story.module.css';
import { useAppContext } from '../../context/AppContext';
import { StorySegment } from './StorySegment';
import { Loader } from './Loader';
import { useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';

export const Story = () => {
  const { storyline } = useAppContext();
  const { isWaiting } = useGame();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when storyline changes or when waiting state changes
  useEffect(() => {
    scrollToBottom();
  }, [storyline, isWaiting]);

  // Add event listener for USER_PROMPT with proper cleanup
  useEffect(() => {
    const handleUserPrompt = () => {
      scrollToBottom();
    };

    window.addEventListener('USER_PROMPT', handleUserPrompt);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('USER_PROMPT', handleUserPrompt);
    };
  }, []);

  const scrollToBottom = () => {
    const container = scrollRef?.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`${styles.story}`}>
      <div className={styles.content} ref={scrollRef}>
        {storyline.map((storySegment) => (
          <StorySegment key={storySegment.id} storySegment={storySegment} />
        ))}
        {isWaiting && <Loader />}
      </div>
    </div>
  );
};
