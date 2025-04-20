import { useState } from 'react';
import styles from './DOSPrompt.module.css';
import { PromptLine } from './PromptLine';
import { v4 as uuidv4 } from 'uuid';
import { useGame } from '../hooks/useGame';
import { availableGameThemes } from '@shared/helpers/gameState';
import { Theme } from '@shared/types/Story';
import { PromptInput } from './PromptInput';
import { isValidGameTheme } from '@shared/helpers/typeValidators';

type SingleDOSPrompt = {
  type: 'user' | 'computer';
  text: string;
  id: string;
};

/* A very dirty prompt simulator. Please don't look. */
export const DOSPrompt = () => {
  const { startGame, loadGame } = useGame();

  const [promptHistory, setPromptHistory] = useState<SingleDOSPrompt[]>([]);

  const handlePrompt = (prompt: string) => {
    if (prompt.startsWith('game start')) {
      const theme = prompt.split(' ').pop()?.replace(/"/g, '') as Theme;

      if (isValidGameTheme(theme)) {
        startGame(theme);
      }

      return isValidGameTheme(theme)
        ? `Starting the game with ${theme} theme.`
        : 'Invalid theme. Please choose from: ' + availableGameThemes.join(', ') + '.';
    }

    if (prompt.startsWith('game restore')) {
      loadGame().then((gameState) => {
        if (!gameState) {
          setPromptHistory((prev) => [
            ...prev,
            { type: 'computer', text: 'No saved game found. Please start a new game.', id: uuidv4() },
          ]);
          return;
        }
      });
      return 'Restoring the game, please wait...';
    }

    if (prompt.startsWith('game restart')) {
      const theme = prompt.split(' ').pop()?.replace(/"/g, '') as Theme;

      if (isValidGameTheme(theme)) {
        startGame(theme, true);
      }

      return isValidGameTheme(theme)
        ? `Restarting the game with ${theme} theme.`
        : 'Invalid theme. Please choose from: ' + availableGameThemes.join(', ') + '.';
    }

    if (prompt.startsWith('help')) {
      return 'Some available commands: game start "theme", game restore, help, exit.';
    }

    if (prompt.startsWith('clear')) {
      setPromptHistory([]);
      return 'Cleared the screen. Nothing to see here!';
    }
    if (prompt.startsWith('git blame')) {
      return 'Blaming Terje from 1998 for all your bugs and spaghetti code.';
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
    if (prompt.startsWith('ls') || prompt.startsWith('dir')) {
      return 'Listing your local files and folders - especially that one folder marked "studies"... ;)';
    }
    if (prompt.startsWith('cd')) {
      const directory = prompt.split(' ').pop();
      return `Ups, ended up deleting '${directory}' instead. Got backups?`;
    }
    if (prompt.startsWith('mkdir')) {
      const directory = prompt.split(' ').pop();
      return `Creating directory '${directory}' failed. Authenticate your Github password here: :X`;
    }
    return 'Unknown command - type "help" for a list of available commands.';
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

  return (
    <div className={styles.DOSPrompt}>
      {promptHistory.map((prompt) => (
        <PromptLine key={prompt.id} text={prompt.text} type={prompt.type} />
      ))}
      <PromptInput onEnter={handleEnter} />
    </div>
  );
};
