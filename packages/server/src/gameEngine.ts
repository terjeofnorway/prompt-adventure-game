import { postImagePromptToLLM, postMessageToLLM } from './llm';
import { getStoryline } from './memory/storage';
import { Message } from './types';

type ProgressStoryParams = {
  message: Message;
};

export const progressStory = async ({ message }: ProgressStoryParams) => {
  const storyline = await getStoryline();

  const includeCharacter = Math.random() < 0.5;

  const messages = [...storyline, message];
  const response = await postMessageToLLM({ messages, includeCharacter });

  if (response.content === null) {
    return response;
  }

  const parsedResponseContent = JSON.parse(response.content);

  const { story, character } = parsedResponseContent;

  const characterImage = await postImagePromptToLLM({ message });
  console.log('characterImage', characterImage);

  const cleanedMessage: Message = {
    role: 'assistant',
    content: story,
  };

  return cleanedMessage;
};
