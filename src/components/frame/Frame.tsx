import { useEffect, useRef } from 'react';
import knobImage from '../../assets/board-knob.svg';
import { useSvgTheme } from './useSvgTheme';
import styles from './Frame.module.css';

export const Frame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themedKnob = useSvgTheme(knobImage, 'fairytale');

  const drawFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!ctx || !themedKnob) return;

    // Draw knobs in corners
    const knobWidth = themedKnob.width;
    const knobHeight = themedKnob.height;

    // Top-left
    ctx.drawImage(themedKnob, 0, 0);

    // Top-right
    ctx.drawImage(themedKnob, canvas.width - knobWidth, 0);

    // Bottom-left
    ctx.drawImage(themedKnob, 0, canvas.height - knobHeight);

    // Bottom-right
    ctx.drawImage(themedKnob, canvas.width - knobWidth, canvas.height - knobHeight);
  };

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !themedKnob) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial setup
    resizeCanvas(canvas);
    drawFrame(ctx, canvas);

    // Handle window resize
    const handleResize = () => {
      resizeCanvas(canvas);
      drawFrame(ctx, canvas);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [themedKnob]); // Add themedKnob to dependencies

  return <canvas ref={canvasRef} className={styles.frame} />;
};
