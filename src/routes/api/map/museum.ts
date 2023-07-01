import {
  Configuration,
  OpenAIApi,
  type ChatCompletionRequestMessage,
  type ChatCompletionFunctions,
} from "openai";
import { OPENAI_API_KEY } from "$env/static/private";

const systemPrompt = `Welcome to the Museum of Generative Art! We're using AI to generate paintings for our museum. We'll start by generating a museum and then we'll generate paintings for it.`;

const museumPrompt = `Let's imagine a museum and write a prompt to generate paintings for it. Choose a theme, an artist, and a twist.
Example themes: portrait of a cat, skyline of an alien city, scene of a piano player inside a speakeasy
Example artists: Pablo Picasso, Zdzislaw Beksinski, M.C. Escher
Example twists: in a vividly colorful style, in the year 3900, in a dark living forest
Here's an example prompt: impressionistic close-up portrait of an otter, colorful geometric background, painting by jim woodring
Call the generateMuseum function to generate the contents of our museum.`;

const museumFunction = {
  name: "generateMuseum",
  description: "Generate a museum.",
  parameters: {
    type: "object",
    properties: {
      theme: {
        type: "string",
        description: "museum theme",
      },
      prompt: {
        type: "string",
        description: "prompt for generating paintings",
      },
    },
    required: ["theme", "prompt"],
  },
};

export class MuseumGenerator {
  private openai: OpenAIApi;

  constructor() {
    this.openai = new OpenAIApi(
      new Configuration({
        apiKey: OPENAI_API_KEY,
      })
    );
  }

  async generateMuseum(): Promise<{ theme: string; prompt: string }> {
    const messages: ChatCompletionRequestMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: museumPrompt },
    ];
    return this.generate(messages, [museumFunction]);
  }

  async generate<T = Record<string, unknown>>(
    messages: ChatCompletionRequestMessage[],
    functions?: ChatCompletionFunctions[]
  ): Promise<T> {
    let retryCount = 0;
    const maxRetries = 2;
    let model = "gpt-3.5-turbo-0613";
    const temperature = 0.7;
    const maxTokens = 1000;

    while (retryCount <= maxRetries) {
      const response = await this.openai.createChatCompletion({
        model,
        temperature: temperature,
        max_tokens: maxTokens,
        messages,
        functions,
        function_call: "auto",
      });

      const functionCall = response.data.choices[0].message?.function_call?.arguments;
      try {
        if (!functionCall) throw new Error("No function call");
        return JSON.parse(functionCall);
      } catch (error) {
        console.error("Failed on message", response.data.choices[0].message);
        retryCount++;
        if (retryCount === maxRetries) {
          model = "gpt-4-0613";
        } else if (retryCount > maxRetries) {
          throw new Error(`Invalid JSON: ${functionCall}`);
        }
      }
    }

    throw new Error("Unexpected error in generate function");
  }
}
