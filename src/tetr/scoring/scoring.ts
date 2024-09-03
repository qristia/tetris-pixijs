import { Tetris } from "../tetris";
import { Scores } from "./scores";
import { TSpin } from "./tspin";

export class Scoring {
  score: number;
  combo: number;
  b2bCombo: number;
  previous: string;
  diffPrevious: string;

  constructor() {
    this.score = 0;
    this.combo = 0;
    this.b2bCombo = 0;
    this.previous = "";
    this.diffPrevious = "";
  }

  calculateScore(game: Tetris, linesCleared: number) {
    const tspin = TSpin.evaluate(game.currentPiece, linesCleared);
    const scoreType = tspin ? tspin : Scores.Line[linesCleared];

    let { score, label, difficult } = scoreType;
    const { level } = game;

    if (difficult) {
      if (this.diffPrevious) {
        score *= level * 1.5;
        this.b2bCombo++;
      }
      this.diffPrevious = label;
    } else if (score > 0) {
      this.diffPrevious = "";
      this.b2bCombo = 0;
      if (this.previous !== "") this.combo++;
      score *= level;
    } else {
      this.combo = 0;
    }

    score += this.combo * level * 50;

    this.score += score;
    this.previous = label;

    return { score, label };
  }

  add(score: number) {
    this.score += score;
  }
}
