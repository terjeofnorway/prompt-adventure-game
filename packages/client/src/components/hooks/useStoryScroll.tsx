import { useEffect, useRef, useState } from 'react';

export const useStoryScroll = (scrollRef: React.RefObject<HTMLDivElement | null>) => {
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

  const dispatchStoryScroll = () => {
    window.dispatchEvent(new Event('STORY_SCROLL'));

    // Clear the timeout if it's already set
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
  };

  const handleScroll = () => {
    if (!scrollTimeout.current) {
      scrollTimeout.current = setTimeout(dispatchStoryScroll, 500);
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
  }, []);

  return { scrollToBottom };
};
