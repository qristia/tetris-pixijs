import { ShapesKey } from "./shapes";
import { Tetris } from "./tetris";
import { random } from "../utils";

export interface Spawner {
  game: Tetris;
  sequence: ShapesKey[];
  get(index: number): ShapesKey;
  clear(): void;
  spawn(): ShapesKey;
  generate(): void;
}

export class SevenBag implements Spawner {
  game: Tetris;
  sequence: ShapesKey[];

  constructor(game: Tetris) {
    this.sequence = [];
    this.game = game;
  }

  clear(): void {
    this.sequence = [];
  }

  get(index: number): ShapesKey {
    return this.sequence[index];
  }

  spawn(): ShapesKey {
    const piece = this.sequence.shift();
    if (this.sequence.length === 4) {
      this.generate();
    }
    if (!piece) throw new Error("no piece");
    return piece;
  }

  generate(): void {
    let sequence: ShapesKey[] = ["I", "J", "L", "O", "S", "T", "Z"];

    while (sequence.length) {
      const rng = Math.floor(random(0, sequence.length));
      this.sequence.push(...sequence.splice(rng, 1));
    }
  }
}
