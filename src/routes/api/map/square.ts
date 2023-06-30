import { Direction, type Location, type Walls } from "./types";
import { allDirections } from "./directions";

export interface Painting {
  direction: Direction;
  imageUrl?: string;
}

export class Square {
  public painting: Painting | null = null;

  constructor(
    public location: Location = { x: 0, y: 0 },
    public walls: Walls = {
      [Direction.North]: true,
      [Direction.East]: true,
      [Direction.South]: true,
      [Direction.West]: true,
    }
  ) {}

  public removeWall(direction: Direction) {
    this.walls[direction] = false;
  }

  public addPainting() {
    const directions = allDirections.filter((direction) => this.walls[direction] === true);
    const direction = directions[Math.floor(Math.random() * directions.length)];
    this.painting = { direction };
  }
}
