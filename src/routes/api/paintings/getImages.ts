import { STABILITY_API_KEY, STABILITY_API_HOST, PAINTING_PROMPT } from "$env/static/private";
import { Buffer } from "buffer";

export async function getImages(count: number) {
  const engineId = "stable-diffusion-512-v2-1";
  const apiHost = STABILITY_API_HOST;
  const apiKey = STABILITY_API_KEY;
  if (!apiKey) throw new Error("Missing Stability API key.");
  if (!apiHost) throw new Error("Missing Stability API host.");

  const response = await fetch(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text_prompts: [
        {
          text: PAINTING_PROMPT,
        },
      ],
      cfg_scale: 7,
      clip_guidance_preset: "FAST_BLUE",
      height: 512,
      width: 512,
      samples: count,
      steps: 20,
    }),
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  interface GenerationResponse {
    artifacts: Array<{
      base64: string;
      seed: number;
      finishReason: string;
    }>;
  }

  const responseJSON = (await response.json()) as GenerationResponse;
  return responseJSON.artifacts.map((artifact) => Buffer.from(artifact.base64, "base64"));
}
