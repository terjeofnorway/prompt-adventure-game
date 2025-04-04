import styles from './Image.module.css';

type ImageProps = {
  imageId: string;
  imageDescription?: string;
  className?: string;
};

export const Image = ({ imageId, className }: ImageProps) => {
  return (
    <div className={`${styles.image} ${className}`}>
      <img src={`${import.meta.env.VITE_API_URL}/api/images/${imageId}`} alt={`Image with ID: ${imageId}`} />
    </div>
  );
};
