import styles from './App.module.css'
import { Header } from './components/Header'
import { Board } from './components/Board'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className={styles.container}>
        <Header className={styles.header} />
        <Board className={styles.board} />
      </div>
    </AppProvider>
  )
}

export default App
