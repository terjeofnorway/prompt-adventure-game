import { useGame } from '../hooks/useGame';
import { useImageWithPolling } from '../hooks/useImageWithPolling';
import { Loader } from '../loader/Loader';
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
    <div className={styles.background} style={backgroundStyle}>
      {loading && <Loader className={styles.loader} text="Loading..." />}
      {error && <div className={styles.error}>Error loading image</div>}
    </div>
  );
};
