import { useGame } from '../hooks/useGame';
import { Loader } from '../loader/Loader';
import styles from './Background.module.css';

export const Background = () => {
  const { backgroundId } = useGame();

  return (
    <div className={styles.background}>
      <Loader className={styles.loader} text="Loading..." />
    </div>
  );
};
