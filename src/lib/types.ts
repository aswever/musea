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
