import { STABILITY_API_KEY, STABILITY_API_HOST } from "$env/static/private";
import { Buffer } from "buffer";
import type { ImageGenerator, ImageGeneratorOptions } from "..";
import { defaultStabilityRequest, type StabilityRequest, type StabilityResponse } from "./types";

export class StabilityGenerator implements ImageGenerator {
  public async generateImages(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions = {},
    advanced: Partial<StabilityRequest> = {}
  ): Promise<Buffer[]> {
    const engineId = "stable-diffusion-xl-beta-v2-2-2";
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
      body: JSON.stringify(this.getRequest(prompt, count, options, advanced)),
    });

    if (!response.ok) {
      throw new Error(`Non-200 response: ${await response.text()}`);
    }

    const responseJSON = (await response.json()) as StabilityResponse;
    return responseJSON.artifacts.map((artifact) => Buffer.from(artifact.base64, "base64"));
  }

  private getRequest(
    prompt: string,
    count: number,
    options: ImageGeneratorOptions,
    advanced: Partial<StabilityRequest>
  ): StabilityRequest {
    return {
      ...defaultStabilityRequest,
      text_prompts: [{ text: prompt }],
      samples: count,
      steps: options.steps ?? defaultStabilityRequest.steps,
      width: options.width ?? defaultStabilityRequest.width,
      height: options.height ?? defaultStabilityRequest.height,
      ...advanced,
    };
  }
}
