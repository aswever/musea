export type Walls = {
	[key in Direction]: boolean;
};

export interface Location {
	x: number;
	y: number;
}

export enum Direction {
	North,
	East,
	South,
	West
}

const allDirections = [Direction.North, Direction.East, Direction.South, Direction.West];

function getOppositeDirection(direction: Direction): Direction {
	switch (direction) {
		case Direction.North:
			return Direction.South;
		case Direction.East:
			return Direction.West;
		case Direction.South:
			return Direction.North;
		case Direction.West:
			return Direction.East;
	}
}

export function getRotationForDirection(direction: Direction): string {
	return `0 ${[Direction.North, Direction.South].includes(direction) ? 0 : 90} 0`;
}

export function getPositionForDirection(
	center: Location,
	direction: Direction,
	forward = false
): string {
	let position = '';
	const offset = forward ? 6.7 : 6.9;
	switch (direction) {
		case Direction.North:
			position = `${center.x} 3 ${center.y - offset}`;
			break;
		case Direction.East:
			position = `${center.x + offset} 3 ${center.y}`;
			break;
		case Direction.South:
			position = `${center.x} 3 ${center.y + offset}`;
			break;
		case Direction.West:
			position = `${center.x - offset} 3 ${center.y}`;
			break;
	}
	return position;
}

export class Square {
	public painting: { direction: Direction } | null = null;

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
		this.painting = { direction };
	}
}

class Map {
	public map: Square[][];
	private currentLocation: Location;
	private startLocation: Location;

	constructor(public width = 10, public height = 10) {
		this.map = new Array(width).fill(null).map(() => new Array(height).fill(null));
		this.startLocation = {
			x: Math.floor(Math.random() * width),
			y: Math.floor(Math.random() * height + 1)
		};
		this.map[this.startLocation.x][this.startLocation.y] = new Square(
			this.positionRelativeToStart(this.startLocation)
		);
		console.log('starting at location', this.startLocation);
		this.currentLocation = this.startLocation;
	}

	private positionRelativeToStart(location: Location): Location {
		return {
			x: location.x - this.startLocation.x,
			y: location.y - this.startLocation.y
		};
	}

	public generateSquares(totalSquares = 10) {
		this.addSquareInDirection(Direction.North);
		for (let i = 0; i < totalSquares; i++) {
			this.addSquareInRandomDirection();
		}
		const currentSquare = this.map[this.currentLocation.x][this.currentLocation.y];
		console.log(
			allDirections.filter((direction) => currentSquare.walls[direction] === false)[0],
			getOppositeDirection(
				allDirections.filter((direction) => currentSquare.walls[direction] === false)[0]
			)
		);
		currentSquare.removeWall(
			getOppositeDirection(
				allDirections.filter((direction) => currentSquare.walls[direction] === false)[0]
			)
		);
	}

	private addSquareInRandomDirection() {
		const directions = [Direction.North, Direction.East, Direction.South, Direction.West];
		const direction = directions[Math.floor(Math.random() * directions.length)];
		this.addSquareInDirection(direction);
	}

	private addSquareInDirection(direction: Direction) {
		console.log('adding new square in direction', direction);
		const newLocation = this.getNewLocation(direction);
		if (this.isLocationValid(newLocation)) {
			const currentSquare = this.map[this.currentLocation.x][this.currentLocation.y];
			currentSquare.removeWall(direction);
			currentSquare.addPainting();
			const newSquare = new Square(this.positionRelativeToStart(newLocation));
			newSquare.removeWall(getOppositeDirection(direction));
			this.map[newLocation.x][newLocation.y] = newSquare;
			this.currentLocation = newLocation;
			console.log('new location', newLocation);
		}
	}

	private getNewLocation(direction: Direction): Location {
		switch (direction) {
			case Direction.North:
				return { x: this.currentLocation.x, y: this.currentLocation.y - 1 };
			case Direction.East:
				return { x: this.currentLocation.x + 1, y: this.currentLocation.y };
			case Direction.South:
				return { x: this.currentLocation.x, y: this.currentLocation.y + 1 };
			case Direction.West:
				return { x: this.currentLocation.x - 1, y: this.currentLocation.y };
		}
	}

	private isLocationValid(location: Location): boolean {
		return (
			location.x >= 0 &&
			location.x < this.width &&
			location.y >= 0 &&
			location.y < this.height &&
			this.map[location.x][location.y] === null
		);
	}

	public listSquares(): Square[] {
		return this.map.flat().filter((square) => square !== null);
	}
}

export function generateMap(width: number, height: number) {
	const map = new Map(width, height);
	map.generateSquares();
	return map;
}
