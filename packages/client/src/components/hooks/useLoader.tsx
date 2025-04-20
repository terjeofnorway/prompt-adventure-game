import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { isValidGameState } from '@shared/helpers/typeValidators';

type UseLoader = {
  isGameReady: boolean;
};

let updateLoadingStateTimeout: NodeJS.Timeout | null = null;

export const useLoader = (): UseLoader => {
  const { gameState, loadingState, setLoadingState } = useAppContext();
  const [isGameReady, setIsGameReady] = useState(false);

  const checkForBackgroundLoaded = async (backgroundId: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/images/${backgroundId}`, {
      method: 'HEAD',
    });
    console.log(response);
    return response.status === 200;
  };

  const updateLoadingState = useCallback(async () => {
    if (updateLoadingStateTimeout) {
      clearTimeout(updateLoadingStateTimeout);
    }
    updateLoadingStateTimeout = setTimeout(updateLoadingState, 1000);

    if (isValidGameState(gameState) && loadingState === 'loading_game') {
      const backgroundImageReady = await checkForBackgroundLoaded(gameState.backgroundId);
      if (backgroundImageReady) {
        setIsGameReady(true);
        setLoadingState(null);
        clearTimeout(updateLoadingStateTimeout!);
      }
      return;
    }
  }, [gameState, loadingState]);

  useEffect(() => {
    updateLoadingState();
  }, [gameState?.gameTheme]);

  return { isGameReady };
};
