import { useState } from 'react';
import styles from './DOSPrompt.module.css';
import { PromptLine } from './PromptLine';
import { v4 as uuidv4 } from 'uuid';

type SingleDOSPrompt = {
  type: 'user' | 'computer';
  text: string;
  id: string;
};

/* A very dirty prompt simulator. Please don't look. */
export const DOSPrompt = () => {
  const [promptHistory, setPromptHistory] = useState<SingleDOSPrompt[]>([]);

  const handlePrompt = (prompt: string) => {
    if (prompt.startsWith('game start')) {
      const validThemes = ['pirate', 'space', 'fantasy'];
      const theme = prompt.split(' ').pop()?.replace(/"/g, '');

      console.log('Theme:', theme);
      return theme && validThemes.includes(theme)
        ? `Starting the game with ${theme} theme.`
        : 'Invalid theme. Please choose from: pirate, space, fantasy.';
    }
    if (prompt.startsWith('help')) {
      return 'Some available commands: game start "theme", help, exit.';
    }

    if (prompt.startsWith('clear')) {
      setPromptHistory([]);
      return 'Cleared the screen.';
    }
    if (prompt.startsWith('git blame')) {
      return 'Blaming Terje from 1998 for all your problems.';
    }

    if (prompt.startsWith('reset')) {
      return 'Rolling world back to 2005. Please wait...';
    }
    if (prompt.startsWith('format c:')) {
      return 'Formatting C: drive. Please wait...';
    }
    if (prompt.startsWith('exit')) {
      return "Exiting. I'm done. Just... I'm out of here.";
    }
    if (prompt.startsWith('ls')) {
      return 'Listing all files and folders - especially that one folder marked "studies"... ;)';
    }
    if (prompt.startsWith('cd')) {
      const directory = prompt.split(' ').pop();
      return `Ups, ended up deleting '${directory}' instead. Got backups?`;
    }
    if (prompt.startsWith('mkdir')) {
      const directory = prompt.split(' ').pop();
      return `Creating directory '${directory}' failed. Authenticate your Github password here: :X`;
    }
    return 'Unknown command';
  };

  const handleEnter = (prompt: string) => {
    const userPrompt: SingleDOSPrompt = { type: 'user', text: prompt, id: uuidv4() };
    setPromptHistory((prev) => [...prev, userPrompt]);

    // Simulate a computer response
    setTimeout(() => {
      const response = handlePrompt(prompt);
      const computerResponse: SingleDOSPrompt = { type: 'computer', text: response, id: uuidv4() };
      setPromptHistory((prev) => [...prev, computerResponse]);
    }, 600);
  };

  console.log(promptHistory);
  return (
    <div className={styles.DOSPrompt}>
      {promptHistory.map((prompt) => (
        <PromptLine key={prompt.id} text={prompt.text} type={prompt.type} onEnter={handleEnter} readonly />
      ))}
      <PromptLine text={''} type="user" onEnter={handleEnter} />
    </div>
  );
};
