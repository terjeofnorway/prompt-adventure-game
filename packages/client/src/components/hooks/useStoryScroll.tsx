import { Storyline } from '@shared/types/Story';
import { useEffect, useRef } from 'react';

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
    if (!container) return;
    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    let maxVisibleHeight = 0;
    let mostVisibleElement: HTMLElement | null = null;
    let closestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    const segmentsWithImage = storyline.filter((story) => {
      return story.meta?.imageId;
    });

    for (const story of segmentsWithImage) {
      const element = scrollRef.current?.querySelector(`#${CSS.escape(story.id)}`) as HTMLElement;
      if (element) {
        const elTop = element.offsetTop;
        const elBottom = elTop + element.offsetHeight;

        const visibleTop = Math.max(elTop, containerTop);
        const visibleBottom = Math.min(elBottom, containerBottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);

        if (
          visibleHeight > maxVisibleHeight ||
          (visibleHeight === maxVisibleHeight && elTop < (mostVisibleElement?.offsetTop ?? Infinity))
        ) {
          maxVisibleHeight = visibleHeight;
          mostVisibleElement = element;
        }

        // Distance from element to nearest visible edge (if not visible)
        const distance =
          visibleHeight > 0 ? 0 : Math.min(Math.abs(elBottom - containerTop), Math.abs(elTop - containerBottom));

        if (distance < minDistance) {
          minDistance = distance;
          closestElement = element;
        }
      }
    }

    const currentElement = mostVisibleElement ?? closestElement;

    const closestStorySegment = storyline.find((story) => story.id === currentElement?.id);

    if (closestStorySegment?.meta?.imageId) {
      const event = new CustomEvent('UPDATE_ILLUSTRATION', {
        detail: { id: closestStorySegment.meta.imageId },
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
