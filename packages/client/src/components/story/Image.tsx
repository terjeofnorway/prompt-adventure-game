import styles from './Image.module.css';

type ImageProps = {
  imageId: string;
  imageDescription?: string;
};

export const Image = ({ imageId }: ImageProps) => {
  return (
    <div className={styles.image}>
      <img src={`${import.meta.env.VITE_API_URL}/api/images/${imageId}`} alt={`Image with ID: ${imageId}`} />
    </div>
  );
};
