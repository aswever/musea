import { json } from '@sveltejs/kit';
import { STABILITY_API_KEY, STABILITY_API_HOST, PAINTING_PROMPT } from '$env/static/private';

export async function GET({ request, platform }) {
	const engineId = 'stable-diffusion-512-v2-1';
	const apiHost = STABILITY_API_HOST;
	const apiKey = STABILITY_API_KEY;

	if (!apiKey) throw new Error('Missing Stability API key.');

	const response = await fetch(`${apiHost}/v1/generation/${engineId}/text-to-image`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text_prompts: [
				{
					text: PAINTING_PROMPT
				}
			],
			cfg_scale: 7,
			clip_guidance_preset: 'FAST_BLUE',
			height: 512,
			width: 512,
			samples: 1,
			steps: 20
		})
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

	try {
		const result = await platform?.env?.IMAGES.put(
			responseJSON.artifacts[0].seed,
			responseJSON.artifacts[0].base64
		);

		console.log(result);
	} catch (e) {
		console.error(e);
	}

	return json({ base64: responseJSON.artifacts[0].base64 });
}
