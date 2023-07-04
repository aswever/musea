import type { ChatMessage } from "openai-fetch";

export const museumSystemMessage: ChatMessage = {
  role: "system",
  content: `Welcome to the Museum of Generative Art! We're using AI to generate paintings for our museum. We'll start by generating a museum and then we'll generate paintings for it.`,
};

export const museumUserMessage: ChatMessage = {
  role: "user",
  content: `Let's imagine a museum and write a prompt to generate paintings for it. Choose a theme, an artist, and a twist.
Example themes: portrait of a cat, skyline of an alien city, scene of a piano player inside a speakeasy
Example artists: Pablo Picasso, Zdzislaw Beksinski, M.C. Escher
Example twists: in a vividly colorful style, in the year 3900, in a dark living forest
Here's an example prompt: impressionistic close-up portrait of an otter, colorful geometric background, painting by jim woodring
Choose a color palette for a museum. Use hex strings like "#000000". Return three colors: one lighter, one medium, and one darker. These are for the walls, floor, and ceiling, and should be colored to fit the theme but not overly saturated.
Call the generateMuseum function to generate the contents of our museum.`,
};
