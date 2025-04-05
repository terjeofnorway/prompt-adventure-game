import { Storyline } from '@shared/types/Story';
import { useCallback, useEffect, useRef } from 'react';

export const useStoryScroll = (storyline: Storyline, scrollRef: React.RefObject<HTMLDivElement | null>) => {
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const checkForStorySegmentPosition = () => {
    const container = scrollRef?.current;
    const containerRect = container?.getBoundingClientRect();

    if (!containerRect) return;

    const topmostSegment = storyline.find((story) => {
      if (!story.id) return false;
      const element = scrollRef.current?.querySelector(`#${CSS.escape(story.id)}`);
      if (element) {
        const rect = element.getBoundingClientRect();

        const innerTop = rect.top - containerRect.top;

        return innerTop >= 0 && innerTop <= containerRect.height / 2;
      }
      return false;
    });

    if (topmostSegment?.meta?.imageId) {
      const event = new CustomEvent('UPDATE_ILLUSTRATION', {
        detail: { id: topmostSegment.meta.imageId },
      });
      window.dispatchEvent(event);
    }
  };

  const waitForScroll = () => {
    checkForStorySegmentPosition();

    // Clear the timeout if it's already set
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
  };

  const handleScroll = () => {
    if (!scrollTimeout.current) {
      scrollTimeout.current = setTimeout(waitForScroll, 500);
    }
  };

  // Add event listener for scrolling on the scrollRef element
  useEffect(() => {
    const container = scrollRef?.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Cleanup function to remove event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return { scrollToBottom };
};
