import styles from './Story.module.css';
import { useAppContext } from '../../context/AppContext';
import { StorySegment } from './StorySegment';
import { Loader } from './Loader';
import { useCallback, useEffect, useRef } from 'react';
import { useGame } from '../hooks/useGame';
import { useStoryScroll } from '../hooks/useStoryScroll';

export const Story = () => {
  const { storyline } = useAppContext();
  const { isWaiting } = useGame();

  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollToBottom } = useStoryScroll(scrollRef);

  // Scroll to bottom when storyline changes or when waiting state changes
  useEffect(() => {
    scrollToBottom();
  }, [storyline, isWaiting]);

  const handleUserPrompt = () => {
    scrollToBottom();
  };

  const checkForStorySegmentPosition = useCallback(() => {
    const topmostSegment = storyline.find((story) => {
      if (!story.id) return false;
      const element = scrollRef.current?.querySelector(`#${CSS.escape(story.id)}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      }
      return false;
    });

    if (topmostSegment?.meta?.imageId) {
      const event = new CustomEvent('UPDATE_ILLUSTRATION', {
        detail: { id: topmostSegment.meta.imageId },
      });
      window.dispatchEvent(event);
    }
  }, [storyline]);

  // Add event listener for USER_PROMPT with proper cleanup
  useEffect(() => {
    window.addEventListener('USER_PROMPT', handleUserPrompt);
    window.addEventListener('STORY_SCROLL', checkForStorySegmentPosition);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('USER_PROMPT', handleUserPrompt);
      window.removeEventListener('STORY_SCROLL', checkForStorySegmentPosition);
    };
  }, [checkForStorySegmentPosition]);

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
