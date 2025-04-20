import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/board/Board';
import { useGame } from './components/hooks/useGame';
import { Illustration } from './components/illustration/Illustration';
import { DOSPrompt } from './components/DOSPrompt/DOSPrompt';
import { Background } from './components/background/Background';

function App() {
  const { gameState } = useGame();

  console.log('App.tsx', gameState);

  return (
    <div className={styles.container}>
      {gameState !== null && <Background />}
      {gameState && <Header />}
      {gameState && <Board />}
      {gameState && <Illustration />}
      {!gameState && <DOSPrompt />}
    </div>
  );
}

export default App;
