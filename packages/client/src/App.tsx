import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styles from './App.module.css';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { NotFound } from './components/NotFound';
import { AppProvider } from './context/AppContext';
import dummyImage from './assets/dummy-image.png';
import { useEffect } from 'react';
import { saveMessage } from './gameengine/db';

function App() {
  useEffect(() => {
    saveMessage('hello world');
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <div className={styles.container} style={{ backgroundImage: `url(${dummyImage})` }}>
          <Header />
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
