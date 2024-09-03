import { outOfBounds } from "../../utils";
import { Mino } from "../mino";
import { ScoreType, Scores } from "./scores";

export const TSpin = {
  pointingSide: [
    [1, 0],
    [2, 1],
    [1, 2],
    [0, 1],
  ],

  _getTotalFilled(mino: Mino) {
    const { cols, rows } = mino.game.board;
    let totalFilled = 0;

    // T piece is only 3 wide
    for (let i = 0; i < 3; i += 2) {
      for (let j = 0; j < 3; j += 2) {
        const x = mino.position.x + j;
        const y = mino.position.y + i;
        if (outOfBounds(x, y, cols, rows) || mino.game.board.getAt(x, y) != "0") {
          totalFilled++;
        }
      }
    }
    return totalFilled;
  },
  _getFacingFilled(mino: Mino) {
    const [tx, ty] = this.pointingSide[mino.rotation];
    let totalFilled = 0;

    const { cols, rows } = mino.game.board;
    const isHorizontal = mino.rotation === 0 || mino.rotation === 2;

    for (let i = 0; i < 3; i += 2) {
      const x = isHorizontal ? mino.position.x + i : mino.position.x + tx;
      const y = isHorizontal ? mino.position.y + ty : mino.position.y + i;
      if (outOfBounds(x, y, cols, rows) || mino.game.board.getAt(x, y) != "0") {
        totalFilled++;
      }
    }
    return totalFilled;
  },
  evaluate(mino: Mino, linesCleared: number) {
    if (mino.name !== "T" || !mino.lastKick) return null;

    const totalCornersFilled = this._getTotalFilled(mino);
    const facingCornersFilled = this._getFacingFilled(mino);
    let score: ScoreType | null = null;

    if (totalCornersFilled >= 3) {
      if (facingCornersFilled === 2 || mino.lastKick === 5) {
        score = { ...Scores.TSpin[linesCleared] };
      } else {
        score = { ...Scores.MiniTSpin[linesCleared] };
      }
    }
    console.log(score, totalCornersFilled, facingCornersFilled)
    return score;
  },
} as const;
