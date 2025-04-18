import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/board/Board';
import { useGame } from './components/hooks/useGame';
import { useEffect } from 'react';
import { Illustration } from './components/illustration/Illustration';
import { DOSPrompt } from './components/DOSPrompt/DOSPrompt';
import { Background } from './components/background/Background';

function App() {
  const { getStoryline, gameTheme } = useGame();

  useEffect(() => {
    getStoryline();
  }, []);

  return (
    <div className={styles.container}>
      {gameTheme && <Header />}
      {gameTheme && <Board />}
      {gameTheme && <Illustration />}
      {!gameTheme && <DOSPrompt />}
      <Background />
    </div>
  );
}

export default App;
