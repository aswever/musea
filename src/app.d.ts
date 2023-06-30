// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import {
  KVNamespace,
  R2Bucket,
  type DurableObjectNamespace,
  type R2Bucket,
} from "@cloudflare/workers-types";

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    interface Platform {
      env?: {
        IMAGES: R2Bucket;
        MAPS: KVNamespace;
      };
    }
  }
}

export {};
