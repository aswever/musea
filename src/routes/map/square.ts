import { Direction, type Location, type Walls } from '../../lib/types';
import { allDirections } from '../../lib/directions';

export class Square {
	public painting: { direction: Direction; url: string } | null = null;

	constructor(
		public location: Location = { x: 0, y: 0 },
		public walls: Walls = {
			[Direction.North]: true,
			[Direction.East]: true,
			[Direction.South]: true,
			[Direction.West]: true
		}
	) {}

	public removeWall(direction: Direction) {
		console.log('removing wall', Direction[direction]);
		this.walls[direction] = false;
		console.log('walls', this.walls);
	}

	public addPainting() {
		const directions = allDirections.filter((direction) => this.walls[direction] === true);
		const direction = directions[Math.floor(Math.random() * directions.length)];
		const number = Math.floor(Math.random() * 4 + 1);
		console.log('adding painting', Direction[direction], number);
		this.painting = {
			direction,
			url: `/cat${number}.png`
		};
	}
}
