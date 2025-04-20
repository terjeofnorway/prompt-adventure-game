import { useGame } from '../hooks/useGame';
import { useImageWithPolling } from '../hooks/useImageWithPolling';
import styles from './Background.module.css';

export const Background = () => {
  const { gameState } = useGame();
  if (!gameState) {
    throw new Error('Game state is not available');
  }
  const { backgroundId } = gameState;

  const { imageSrc, loading, error } = useImageWithPolling(backgroundId);

  const backgroundStyle =
    imageSrc && !loading
      ? {
          backgroundImage: `url(${imageSrc})`,
        }
      : {};

  return (
    <div className={`${styles.background} ${imageSrc && !loading ? styles.fadeIn : ''}`} style={backgroundStyle}>
      {error && <div className={styles.error}>Error loading image</div>}
    </div>
  );
};
