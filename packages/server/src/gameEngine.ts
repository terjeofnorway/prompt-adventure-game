import { postImagePromptToLLM, postMessageToLLM } from './llm';
import { getStoryline } from './memory/storage';
import { AIMessage } from './types';

type ProgressStoryParams = {
  message: AIMessage;
};

export const progressStory = async ({ message }: ProgressStoryParams) => {
  console.log('--------------------------------');
  console.log('progressStory');
  console.log('--------------------------------');
  const storyline = await getStoryline();

  const includeCharacter = Math.random() < 0.5;

  const messages = [...storyline, message];
  const response = await postMessageToLLM({ messages, includeCharacter });

  if (response.content === null) {
    return response;
  }

  const parsedResponseContent = JSON.parse(response.content);

  const { story, characterDescription } = parsedResponseContent;

  console.log('Story:');
  console.log(story);
  console.log('--------------------------------');
  console.log('Character Description:');
  console.log(characterDescription);
  console.log('--------------------------------');

  const characterImage = await postImagePromptToLLM(characterDescription);
  console.log('characterImage', characterImage);

  const cleanedMessage: AIMessage = {
    role: 'assistant',
    content: story,
  };

  return cleanedMessage;
};

export const getFullStory = async () => {
  const storyline = await getStoryline();
  return storyline;
};
