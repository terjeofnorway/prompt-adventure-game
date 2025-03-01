import { useEffect, useState } from 'react';

export const useDragAndResize = (containerRef: React.RefObject<HTMLElement | null>) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentPos, setCurrentPos] = useState([0, 0]);
  const [originalSize, setOriginalSize] = useState([0, 0]);

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
    setOriginalSize([containerRef.current.clientWidth, containerRef.current.clientHeight]);
  };

  const handleMouseUp = () => {
    console.log('mouse up');
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    setCurrentPos([e.clientX, e.clientY]);
  };

  useEffect(() => {
    if (isDragging) {
      if (!containerRef.current) return;
      const [currentX, currentY] = currentPos;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const newWidth = originalSize[0] + deltaX;
      const newHeight = originalSize[1] + deltaY;
      containerRef.current.style.width = `${newWidth}px`;
      containerRef.current.style.height = `${newHeight}px`;
    }
  }, [currentPos[0], currentPos[1], isDragging]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    container.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
};
