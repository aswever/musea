import { allDirections, getOppositeDirection } from "./directions";
import { Direction, type Location } from "./types";
import { Square, type Painting } from "./square";
import type { R2Bucket } from "@cloudflare/workers-types";
import { getImages } from "../paintings/getImages";

export class Layout {
  public map: Square[][];
  private currentLocation: Location;
  private startLocation: Location;

  constructor(public width = 10, public height = 10) {
    this.map = new Array(width).fill(null).map(() => new Array(height).fill(null));
    this.startLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height + 1),
    };
    this.map[this.startLocation.x][this.startLocation.y] = new Square(
      this.positionRelativeToStart(this.startLocation)
    );
    this.currentLocation = this.startLocation;
  }

  private positionRelativeToStart(location: Location): Location {
    return {
      x: location.x - this.startLocation.x,
      y: location.y - this.startLocation.y,
    };
  }

  public generateMap(totalSquares = 10) {
    this.addSquareInDirection(Direction.North);
    for (let i = 0; i < totalSquares; i++) {
      this.addSquareInRandomDirection();
    }
    const currentSquare = this.map[this.currentLocation.x][this.currentLocation.y];

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
    const newLocation = this.getNewLocation(direction);
    if (this.isLocationValid(newLocation)) {
      const currentSquare = this.map[this.currentLocation.x][this.currentLocation.y];
      currentSquare.removeWall(direction);
      currentSquare.addPainting();

      const newSquare = new Square(this.positionRelativeToStart(newLocation));
      newSquare.removeWall(getOppositeDirection(direction));
      this.map[newLocation.x][newLocation.y] = newSquare;
      this.currentLocation = newLocation;
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

  public async generatePaintings(imageBucket: R2Bucket, date: string): Promise<void> {
    const paintings = this.listSquares()
      .filter((square) => square.painting !== null)
      .map((square) => square.painting as Painting);

    const images = await getImages(paintings.length, imageBucket, date);

    for (const index in images) {
      paintings[index].imageUrl = images[index].imageUrl;
    }
  }

  public listSquares(): Square[] {
    return this.map.flat().filter((square) => square !== null);
  }

  static generateLayout(width: number, height: number) {
    const layout = new Layout(width, height);
    layout.generateMap();
    return layout;
  }
}
