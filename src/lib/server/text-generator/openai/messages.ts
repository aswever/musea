import { MUSEUM_PARAMS_PROMPT, MUSEUM_PARAMS_SYSTEM_PROMPT } from "$env/static/private";
import type { ChatMessage } from "openai-fetch";

export const museumSystemMessage: ChatMessage = {
  role: "system",
  content: MUSEUM_PARAMS_SYSTEM_PROMPT,
};

export const museumUserMessage: ChatMessage = {
  role: "user",
  content: MUSEUM_PARAMS_PROMPT,
};
