import { Sprite } from "pixi.js";

// type BlockRenderMode = "texture" | "rect";

export class Block extends Sprite {
//   mode: BlockRenderMode;
  animating: boolean;

  constructor() {
    super();
    // this.mode = "texture";
    this.animating = false;
  }
}
