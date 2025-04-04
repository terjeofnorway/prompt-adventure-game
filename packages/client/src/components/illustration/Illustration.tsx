import { Frame } from '../frame/Frame';
import { Image } from './Image';

import styles from './Illustration.module.css';
import { useEffect, useState } from 'react';

export const Illustration = () => {
  const [imageId, setImageId] = useState<string | null>(null);
  const setNewImageId = (e: any) => {
    const imageId = e.detail.id;
    setImageId(imageId);
  };
  useEffect(() => {
    window.addEventListener('UPDATE_ILLUSTRATION', setNewImageId);
    return () => {
      window.removeEventListener('UPDATE_ILLUSTRATION', setNewImageId);
    };
  }, []);
  return (
    <div className={styles.illustration}>
      <Frame />
      {imageId && <Image imageId={imageId} className={styles.image} />}
    </div>
  );
};
