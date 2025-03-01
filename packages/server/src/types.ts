import { OpenAI } from 'openai';


export type Message =
  | OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam
  | OpenAI.Chat.Completions.ChatCompletionSystemMessageParam
  | { role: 'user'; content: string };
