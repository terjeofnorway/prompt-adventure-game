import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/board/Board';
import dummyImage from './assets/dummy-image.png';
import { useGame } from './components/hooks/useGame';
import { useEffect } from 'react';
import { Illustration } from './components/illustration/Illustration';

function App() {
  const { getStoryline } = useGame();

  useEffect(() => {
    getStoryline();
  }, []);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${dummyImage})` }}>
      <Header />
      <Board />
      <Illustration />
    </div>
  );
}

export default App;
