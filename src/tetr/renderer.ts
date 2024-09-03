import { Sprite, Texture } from "pixi.js";
import { GameSettings } from "../settings";
import BaseContainer from "../baseContainer";
import { setTexture } from "../utils";
import { Mino } from "./mino";
import { eachBlock } from "./shapes";

export default class Renderer extends BaseContainer {
  constructor(rows?: number, cols?: number) {
    const { cols: _cols, rows: _rows, offField } = GameSettings;
    super(rows ?? _rows + offField, cols ?? _cols);

    this.adjustPosition();
  }

  adjustPosition() {
    const { offField, boardW, boardH, width, height, cellSize } = GameSettings;
    this.x = (width - boardW) / 2;
    this.y = (height - boardH) / 2 - offField * cellSize;
  }

  updateBlock(
    row: number,
    col: number,
    piece: string | null,
    options?: { tint?: number; alpha?: number }
  ) {
    const { cellSize } = GameSettings;
    const spr = this.sprites[row][col];
    if (spr.animating) return;

    const newSpr = piece ? Texture.from(piece) : Texture.EMPTY;

    if (options) {
      if (options.tint) spr.tint = options.tint;
      if (options.alpha) spr.alpha = options.alpha;
    }

    if (spr.texture == newSpr) return;

    setTexture(spr, newSpr, cellSize, cellSize);
  }

  updateBoard(board: string[][]) {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const block = board[y][x];
        this.updateBlock(y, x, block == "0" ? null : block, { alpha: 1 });
      }
    }
  }

  changeAlpha(mino: Mino, alpha: number, delta: number) {
    if (delta <= 0) {
      return;
    }
    eachBlock(mino.name, mino.position, mino.rotation, (x, y) => {
      const spr = this.sprites[y][x];
      spr.alpha = alpha;
    });
  }
}
