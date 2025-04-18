import { OpenAI } from 'openai';

export type RawUserMessage = {
  role: 'user';
  content: string;
};

export type AIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | OpenAI.Chat.Completions.ChatCompletionUserMessageParam
  | OpenAI.Chat.Completions.ChatCompletionDeveloperMessageParam;

export type ImageSize = 'small' | 'medium' | 'large' | 'xlarge';
