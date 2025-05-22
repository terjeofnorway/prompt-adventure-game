import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
export type RawUserMessage = {
  role: 'user';
  content: string;
};

export type OpenAIMessage =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | OpenAI.Chat.Completions.ChatCompletionUserMessageParam
  | OpenAI.Chat.Completions.ChatCompletionDeveloperMessageParam;

export type AnthropicMessage = Anthropic.Messages.Message;

export type ImageContext = 'situation' | 'background';
