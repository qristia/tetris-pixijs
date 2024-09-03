import { Tetris } from "../tetr/tetris";

export class Animation {
  duration: number;
  animating: boolean;
  over: boolean;
  startTime: number;

  constructor(duration: number) {
    this.duration = duration;
    this.animating = false;
    this.over = false;
    this.startTime = 0;

    this.start();
  }

  protected onUpdate(t: number) {}
  protected onStart() {}
  protected onStop() {}

  update() {
    if (!this.animating) return;
    const t = Math.min((performance.now() - this.startTime) / this.duration, 1);
    if (t >= 1) {
      this.stop();
      return;
    }
    this.onUpdate(t);
  }

  start() {
    this.startTime = performance.now();
    this.animating = true;
    this.onStart();
  }

  stop() {
    this.animating = false;
    this.over = true;
    this.onStop();
  }
}

export class LineClearAnimation extends Animation {
  game: Tetris;
  linesRowIndex: number[];

  constructor(game: Tetris, linesRowIndex: number[]) {
    super(300);

    this.game = game;
    this.linesRowIndex = linesRowIndex;
  }

  protected onUpdate(t: number) {
    const sprites = this.game.renderer.sprites;
    this.linesRowIndex.forEach((value) => {
      for (let x = 0; x < sprites[value].length; x++) {
        const block = sprites[value][x];
        block.animating = true;
        block.alpha = Math.max(1 - t, 0);
      }
    });
  }

  protected onStop() {
    const sprites = this.game.renderer.sprites;
    this.linesRowIndex.forEach((value) => {
      for (let x = 0; x < sprites[value].length; x++) {
        const block = sprites[value][x];
        block.animating = false;
      }
    });
  }
}
