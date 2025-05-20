import { useState } from 'react';
import styles from './App.module.css';

function App() {
  const [selectedTheme, setSelectedTheme] = useState('pirate');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = () => {
    // TODO: Implement prompt handling
    setResponse('Response will appear here');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Prompt Playground</h1>

      <div className={styles.controls}>
        <select className={styles.select} value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)}>
          <option value="pirate">Pirate</option>
          <option value="space">Space</option>
          <option value="fairytale">Fairytale</option>
        </select>

        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
        />

        <button className={styles.button} onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className={styles.response}>
        <h2>Response:</h2>
        <div className={styles.responseContent}>{response}</div>
      </div>
    </div>
  );
}

export default App;
