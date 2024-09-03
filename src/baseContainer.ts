import { Container, Texture } from "pixi.js";
import { GameSettings } from "./settings";
import { setTexture } from "./utils";
import { Block } from "./baseBlock";

export default class BaseContainer extends Container {
  rows: number;
  cols: number;
  sprites: Block[][];

  constructor(rows: number, cols: number, x = 0, y = 0) {
    super();
    this.rows = rows;
    this.cols = cols;
    this.sprites = [];

    const { cellSize } = GameSettings;

    for (let i = 0; i < rows; ++i) {
      let row = [];
      for (let j = 0; j < this.cols; ++j) {
        let spr = new Block();
        spr.x = j * cellSize;
        spr.y = i * cellSize;
        row.push(spr);
        this.addChild(spr);
      }
      this.sprites.push(row);
    }

    this.x = x;
    this.y = y;
  }

  clear() {
    const { cellSize } = GameSettings;
    for (let i = 0; i < this.sprites.length; ++i) {
      for (let j = 0; j < this.sprites[i].length; ++j) {
        const spr = this.sprites[i][j];
        setTexture(spr, Texture.EMPTY, cellSize, cellSize);
        spr.x = j * cellSize;
        spr.y = i * cellSize;
      }
    }
  }
}
