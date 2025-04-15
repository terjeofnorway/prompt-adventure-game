import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/board/Board';
import startImage from './assets/start-image.png';
import { useGame } from './components/hooks/useGame';
import { useEffect } from 'react';
import { Illustration } from './components/illustration/Illustration';
import { DOSPrompt } from './components/DOSPrompt/DOSPrompt';

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
    </div>
  );
}

export default App;
