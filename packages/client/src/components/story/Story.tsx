import styles from './Story.module.css';
import { useAppContext } from '../../context/AppContext';
import { StorySegment } from './StorySegment';
import { Loader } from '../loader/Loader';
import { useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { useStoryScroll } from '../hooks/useStoryScroll';
import { isValidGameState } from '@shared/helpers/typeValidators';

export const Story = () => {
  const { gameState } = useAppContext();

  if (!isValidGameState(gameState)) {
    throw new Error('Invalid game state');
  }

  const { isWaiting } = useGame();
  const { storyline } = gameState;

  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollToBottom } = useStoryScroll(storyline, scrollRef);

  // Scroll to bottom when storyline changes or when waiting state changes
  useEffect(() => {
    scrollToBottom();
  }, [storyline, isWaiting]);

  const handleUserPrompt = () => {
    scrollToBottom();
  };

  // Add event listener for USER_PROMPT with proper cleanup
  useEffect(() => {
    window.addEventListener('USER_PROMPT', handleUserPrompt);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('USER_PROMPT', handleUserPrompt);
    };
  }, []);

  return (
    <div className={`${styles.story}`} ref={scrollRef}>
      <div className={styles.content}>
        {storyline.map((storySegment) => (
          <StorySegment key={storySegment.id} storySegment={storySegment} />
        ))}
        {isWaiting && <Loader />}
      </div>
    </div>
  );
};
