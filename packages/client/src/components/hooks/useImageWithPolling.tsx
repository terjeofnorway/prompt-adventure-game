import { useEffect, useState } from 'react';

export const useImageWithPolling = (imageId: string, pollingInterval = 2000) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: number | null = null;

    const checkImage = async () => {
      try {
        const imageUrl = `${import.meta.env.VITE_API_URL}/api/images/${imageId}`;
        const response = await fetch(imageUrl, { method: 'HEAD' });

        if (!isMounted) return;

        if (response.status === 200) {
          setImageSrc(imageUrl);
          setLoading(false);
        } else if (response.status === 202) {
          // Image is still processing, retry after interval
          timeoutId = window.setTimeout(checkImage, pollingInterval);
        } else {
          throw new Error(`Failed to load image: ${response.status}`);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    };

    checkImage();

    return () => {
      isMounted = false;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [imageId, pollingInterval]);

  return { imageSrc, loading, error };
};
