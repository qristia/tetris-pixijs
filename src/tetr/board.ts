import { eachBlock } from "./shapes";
import { Mino } from "./mino";

export class Board {
  rows: number;
  cols: number;
  private board: string[][];

  constructor(rows: number, cols: number) {
    this.board = [];
    this.rows = rows;
    this.cols = cols;

    for (let i = 0; i < rows; i++) {
      this.board.push(new Array(cols).fill("0", 0, cols));
    }
  }

  get() {
    return this.board;
  }

  getAt(x: number, y: number) {
    if (this.board[y]) {
      return this.board[y][x];
    }
    return "";
  }

  set(board: string[][]) {
    this.board = board;
  }

  putMino(mino: Mino) {
    eachBlock(mino.name, mino.position, mino.rotation, (x, y) => {
      this.board[y][x] = mino.name;
    });
  }

  getFilledLines() {
    const indices: number[] = [];
    for (let i = this.board.length - 1; i >= 0; i--) {
      if (this.board[i].every((el) => el != "0")) indices.push(i);
    }
    return indices;
  }

  clearLines(lines: number[]) {
    for (let i = 0; i < lines.length; i++) {
      let y = lines[i] + i;
      this.board.splice(y, 1);
      this.board.unshift(new Array(this.cols).fill("0", 0, this.cols));
    }
    return lines;
  }
}
