import { IMAGEGEN_PROVIDER } from "$env/static/private";
import type { Buffer } from "buffer";
import { StabilityGenerator } from "./stability";
import { AutomaticGenerator } from "./automatic";

export interface ImageGeneratorOptions {
  count?: number;
  steps?: number;
  width?: number;
  height?: number;
}

export abstract class ImageGenerator {
  abstract generateImages(
    prompt: string,
    count: number,
    options?: Partial<ImageGeneratorOptions>
  ): Promise<Buffer[]>;

  static create(provider = IMAGEGEN_PROVIDER): ImageGenerator {
    if (provider === "stability") {
      return new StabilityGenerator();
    } else if (provider === "automatic") {
      return new AutomaticGenerator();
    } else {
      throw new Error(`Invalid image generator provider: ${provider}`);
    }
  }
}
