import { json } from '@sveltejs/kit';
import { STABILITY_API_KEY, STABILITY_API_HOST, PAINTING_PROMPT } from '$env/static/private';
import axios from 'axios';

export async function GET() {
	const engineId = 'stable-diffusion-512-v2-1';
	const apiHost = STABILITY_API_HOST;
	const apiKey = STABILITY_API_KEY;

	if (!apiKey) throw new Error('Missing Stability API key.');

	const response = await axios.post(
		`${apiHost}/v1/generation/${engineId}/text-to-image`,
		{
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
		},
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${apiKey}`
			}
		}
	);

	if (response.status !== 200) {
		throw new Error(`Stability API returned ${response.status} ${response.statusText}`);
	}

	interface GenerationResponse {
		artifacts: Array<{
			base64: string;
			seed: number;
			finishReason: string;
		}>;
	}

	const responseJSON = response.data as GenerationResponse;

	return json({ base64: responseJSON.artifacts[0].base64 });
}
