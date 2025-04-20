import { useGame } from './components/hooks/useGame';
import { DOSPrompt } from './components/DOSPrompt/DOSPrompt';
import { Game } from './Game';
import { Loader } from './components/loader/Loader';

import styles from './App.module.css';
import { useLoader } from './components/hooks/useLoader';

function App() {
  const { gameState, loadingState } = useGame();
  const { isGameReady } = useLoader();

  const isGameLoading = loadingState === 'loading_game';
  const isLobby = !isGameLoading && gameState === null;

  return (
    <div className={styles.container}>
      {isGameLoading && <Loader className={styles.loader} text="Loading..." />}
      {isGameReady && <Game />}
      {isLobby && <DOSPrompt />}
    </div>
  );
}

export default App;
