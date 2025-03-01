import { useEffect, useRef } from 'react';
import knobImage from '../../assets/board-knob.svg';
import sideImage from '../../assets/board-side.svg';
import { useSvgTheme } from '../hooks/useSvgTheme';
import styles from './Frame.module.css';

export const Frame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themedKnob = useSvgTheme(knobImage, 'fairytale');
  const themedSide = useSvgTheme(sideImage, 'fairytale');

  const drawFrame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!ctx || !themedKnob || !themedSide) return;

    // Draw left side panel
    const sideWidth = themedSide.width;
    const singleTranslatedPixel = sideWidth / 6;

    // Left Panel
    ctx.drawImage(themedSide, singleTranslatedPixel, 0, sideWidth, canvas.height);

    // Right panel
    ctx.save();
    ctx.translate(canvas.width - sideWidth, 0);
    ctx.scale(1, -1);
    ctx.drawImage(themedSide, -singleTranslatedPixel, -canvas.height, sideWidth, canvas.height);
    ctx.restore();

    // Top panel
    ctx.save();
    ctx.translate(0, 0);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(themedSide, singleTranslatedPixel, -canvas.width, sideWidth, canvas.width);
    ctx.restore();

    // Bottom panel
    ctx.save();
    ctx.translate(0, canvas.height - sideWidth);
    ctx.rotate(-Math.PI / 2);
    ctx.scale(-1, 1);
    ctx.drawImage(themedSide, -singleTranslatedPixel, 0, sideWidth, canvas.width);
    ctx.restore();

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

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    drawFrame(ctx, canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !themedKnob) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial setup
    resizeCanvas();
    drawFrame(ctx, canvas);
  }, [themedKnob]); // Add themedKnob to dependencies

  return <canvas ref={canvasRef} className={styles.frame} />;
};
