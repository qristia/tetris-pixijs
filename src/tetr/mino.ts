import { ShapesKey, eachBlock, isValidMove } from "./shapes";
import { Vec2 } from "../utils";
import { SRS_Wallkick, wallkick } from "./wallkicks";
import { Tetris } from "./tetris";

export const Rotations = {
  CounterClockwise: -1,
  Clockwise: 1,
  R180: 2,
} as const;

export class Mino {
  name: ShapesKey;
  position: Vec2;
  rotation: number;
  lastKick: number;
  isColliding: boolean;

  game: Tetris;

  alpha: number;

  constructor(name: ShapesKey, game: Tetris) {
    this.name = name;
    this.game = game;
    this.rotation = 0;
    this.lastKick = 0;
    const x = Math.floor((game.board.cols - 4) / 2);
    this.position = { x, y: 0 };
    this.isColliding = false;

    this.alpha = 1;
  }

  move(x: number, y: number) {
    this.position.x += x;
    this.position.y += y;
    this.lastKick = 0;
  }

  update() {
    this.isColliding = !isValidMove(
      this.game.board,
      this.name,
      {
        ...this.position,
        y: this.position.y + 1,
      },
      this.rotation
    );
  }

  findMaxY() {
    for (let i = this.position.y; i < this.game.board.rows; i++) {
      if (
        !isValidMove(
          this.game.board,
          this.name,
          { ...this.position, y: i },
          this.rotation
        )
      )
        return i - 1;
    }
    return this.position.y;
  }

  rotate(rotation: keyof typeof Rotations) {
    const rot = Rotations[rotation];

    let nextRotation = this.rotation;
    if (rotation === "CounterClockwise" && this.rotation <= 0) {
      nextRotation = 3;
    } else {
      nextRotation = (nextRotation + rot) % 4;
    }

    if (rotation === "R180") {
      if (
        isValidMove(this.game.board, this.name, this.position, nextRotation)
      ) {
        this.rotation = nextRotation;
        this.lastKick = 0;
        this.game.cancelLock();
      }
      return;
    }

    const newPosition = wallkick(SRS_Wallkick, this, nextRotation);
    if (!newPosition) return;
    this.rotation = nextRotation;
    this.lastKick = newPosition.kick + 1;
    this.position = newPosition.pos;
    this.game.cancelLock();
  }

  draw() {
    eachBlock(this.name, this.position, this.rotation, (x, y) => {
      this.game.renderer.updateBlock(y, x, this.name, { alpha: this.alpha });
    });
  }

  drawGhost() {
    // const color = getColor(this.name);
    const gy = this.findMaxY();
    eachBlock(this.name, { ...this.position, y: gy }, this.rotation, (x, y) => {
      this.game.renderer.updateBlock(y, x, "ghost");
    });
  }
}
