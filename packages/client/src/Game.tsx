import { Header } from './components/Header';
import { Board } from './components/board/Board';
import { Illustration } from './components/illustration/Illustration';
import { Background } from './components/background/Background';

export const Game = () => {
  return (
    <>
      <Background />
      <Header />
      <Board />
      <Illustration />
    </>
  );
};
