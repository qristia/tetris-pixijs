import { Application } from "pixi.js";
import { GameSettings, UserSettings } from "../settings";
import { ShapesKey, isValidMove } from "./shapes";
import { Mino } from "./mino";
import { Vec2, getSpeed } from "../utils";
import Renderer from "./renderer";
import { SevenBag, Spawner } from "./spawner";
import HoldContainer from "../ui/hold";
import NextContainer from "../ui/next";
import { Board } from "./board";
import { Animation, LineClearAnimation } from "../animations/animation";
import { Scoring } from "./scoring/scoring";
import { renderScoreText } from "./scoring/renderer";

let startLevel = 0;

export class Tetris {
  gameover: boolean;
  speed: number;
  level: number;
  scoring: Scoring;

  board: Board;
  spawner: Spawner;

  currentPiece: Mino;
  holdPiece: ShapesKey | null;
  canSwapHold: boolean;

  softDropping: boolean;
  lastFallTime: number;
  startLockingTime: number;
  cancelsCount: number;
  isLocking: boolean;

  app: Application;
  renderer: Renderer;
  holdContainer: HoldContainer;
  nextContainer: NextContainer;

  animations: Animation[];

  constructor(app: Application, spawner?: Spawner) {
    this.gameover = false;
    this.level = startLevel;
    this.speed = getSpeed(this.level);
    this.scoring = new Scoring();

    this.canSwapHold = true;
    this.holdPiece = null;
    this.softDropping = false;

    this.startLockingTime = 0;
    this.cancelsCount = 0;
    this.isLocking = false;

    this.lastFallTime = 0;

    this.spawner = spawner ?? new SevenBag(this);

    this.app = app;
    this.renderer = new Renderer();
    this.holdContainer = new HoldContainer();
    this.nextContainer = new NextContainer(GameSettings.previewCount);
    this.animations = [];

    const { rows, offField, cols } = GameSettings;
    this.board = new Board(rows + offField, cols);
    this.currentPiece = new Mino("T", this);

    app.stage.addChild(this.holdContainer);
    app.stage.addChild(this.nextContainer);
    app.stage.addChild(this.renderer);

    this.setup();
  }

  setup() {
    this.spawner.generate();
    this.nextMino();
  }

  update() {
    if (!this.currentPiece) return;

    this.currentPiece.update();
    this.animate();

    if (!this.currentPiece.isColliding) {
      this.drop();
    } else {
      this.tryLock();
    }
  }

  animate() {
    for (let i = this.animations.length - 1; i >= 0; i--) {
      const animation = this.animations[i];
      animation.update();
      if (animation.over) {
        this.animations.splice(i, 1);
      }
    }
  }

  move(dir: number) {
    if (!this.currentPiece) return;

    const nextPos = {
      x: this.currentPiece.position.x + dir,
      y: this.currentPiece.position.y,
    };

    if (this.isValidMovement(nextPos)) {
      this.currentPiece.move(dir, 0);
      this.cancelLock();
    }
  }

  drop() {
    const now = performance.now();
    const normalSpeed = 1000 / (60 * this.speed);
    let speed = this.softDropping
      ? normalSpeed / UserSettings.SDF
      : normalSpeed;

    if (now - this.lastFallTime <= speed) return;

    this.currentPiece.move(0, 1);

    this.lastFallTime = now;
  }

  hardDrop() {
    this.currentPiece.position.y = this.currentPiece.findMaxY();
    this.lock();
  }

  softDrop(value: boolean) {
    this.softDropping = value;
  }

  cancelLock() {
    if (this.cancelsCount >= GameSettings.maxLockCancels) return;

    if (this.isLocking) this.cancelsCount++;
    this.isLocking = false;
    this.currentPiece.alpha = 1;
    // this.renderer.animatedBlocks.clear();
  }

  tryLock() {
    const { lockDelay } = GameSettings;

    if (!this.isLocking) this.startLockingTime = performance.now();
    this.isLocking = true;

    const delta = performance.now() - this.startLockingTime;

    if (delta >= lockDelay) {
      this.lock();
    } else if (delta >= 0) {
      const alpha = Math.max(1 - delta / lockDelay, 0.5);
      this.currentPiece.alpha = alpha;
      // this.renderer.changeAlpha(this.currentPiece, alpha, delta);
    }
  }

  lock() {
    if (!this.currentPiece) return;

    this.cancelsCount = 0;
    this.isLocking = false;

    this.board.putMino(this.currentPiece);
    this.clearLines();
    this.nextMino();
  }

  clearLines() {
    const lines = this.board.getFilledLines();
    const score = this.scoring.calculateScore(this, lines.length);
    this.board.clearLines(lines);

    renderScoreText(
      this,
      score.label,
      this.scoring.combo,
      this.scoring.b2bCombo
    );
    
    if (!lines.length) return;
    // this.animations.push(new LineClearAnimation(this, lines));
  }

  draw() {
    this.renderer.updateBoard(this.board.get());
    this.currentPiece.drawGhost();
    this.currentPiece.draw();
  }

  nextMino(mino?: ShapesKey) {
    this.isLocking = false;
    this.cancelsCount = 0;
    this.currentPiece = new Mino(mino ?? this.spawner.spawn(), this);
    this.canSwapHold = true;

    this.nextContainer.update(this.spawner.sequence);
  }

  swapHold() {
    let curr = this.currentPiece;
    if (!this.canSwapHold) return;

    if (this.holdPiece == null) {
      this.holdPiece = curr.name;
      this.nextMino();
    } else {
      this.nextMino(this.holdPiece);
      this.holdPiece = curr.name;
    }

    this.holdContainer.update(this.holdPiece);
    this.canSwapHold = false;
  }

  isValidMovement(pos: Vec2) {
    return isValidMove(
      this.board,
      this.currentPiece.name,
      pos,
      this.currentPiece.rotation
    );
  }

  stopGame() {
    this.gameover = true;
  }

  isGameOver() {
    alert("dead");
    return this.gameover;
  }
}
