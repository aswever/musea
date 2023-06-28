import { json } from '@sveltejs/kit';
import { Layout } from './layout';

export function GET() {
	const layout = Layout.generateLayout(5, 5);

	return json(layout.listSquares());
}
