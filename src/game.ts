import { Application, Sprite, Texture } from "pixi.js";
import { Tetris } from "./tetr/tetris";
import { handleKeys } from "./controls";
import { GameSettings } from "./settings";

export let game: Tetris;

export function gameSetup(app: Application) {
  if (game) {
    app.stage.removeChild(game.holdContainer);
    app.stage.removeChild(game.nextContainer);
  }

  const { width, height, boardW, boardH } = GameSettings;

  const grid = new Sprite({
    texture: Texture.from("grid"),
    width: boardW,
    height: boardH,
    x: (width - boardW) / 2,
    y: (height - boardH) / 2,
    alpha: 0.2,
  });

  app.stage.addChild(grid);
  game = new Tetris(app);
}

export function gameLoop() {
  game.update();
  game.draw();
  handleKeys();
}
