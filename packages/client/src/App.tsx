import { Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { NotFound } from './components/NotFound';
import dummyImage from './assets/dummy-image.png';
import { useGame } from './components/hooks/useGame';
import { useEffect } from 'react';

function App() {
  const { getFullStory, story } = useGame();

  useEffect(() => {
    getFullStory();
  }, []);

  console.log(story);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${dummyImage})` }}>
      <Header />
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
