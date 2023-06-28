// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface Platform {
			env?: {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				IMAGES: any;
			};
		}
	}
}

export {};
