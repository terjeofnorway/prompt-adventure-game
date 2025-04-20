import styles from './Image.module.css';
import { useImageWithPolling } from '../hooks/useImageWithPolling';

type ImageProps = {
  imageId: string;
  imageDescription?: string;
  className?: string;
  pollingInterval?: number;
};

export const Image = ({ imageId, imageDescription, className, pollingInterval = 2000 }: ImageProps) => {
  const { imageSrc, loading, error } = useImageWithPolling(imageId, pollingInterval);

  return (
    <div className={`${styles.image} ${className || ''}`}>
      {loading && <div className={styles.loading}>Loading image...</div>}
      {error && <div className={styles.error}>Failed to load image</div>}
      {imageSrc && <img src={imageSrc} alt={imageDescription || `Image with ID: ${imageId}`} />}
    </div>
  );
};
