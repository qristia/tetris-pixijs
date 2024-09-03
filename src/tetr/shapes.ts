import { GameSettings } from "../settings";
import { Vec2 } from "../utils";
import { Board } from "./board";

export type ShapesKey = "I" | "J" | "L" | "O" | "S" | "T" | "Z";

const Shapes: Record<ShapesKey, number[]> = {
  I: [0x0f00, 0x2222, 0x00f0, 0x4444],
  J: [0x8e00, 0x6440, 0x0e20, 0x44c0],
  L: [0x2e00, 0x4460, 0x0e80, 0xc440],
  O: [0x6600, 0x6600, 0x6600, 0x6600],
  S: [0x6c00, 0x4620, 0x06c0, 0x8c40],
  T: [0x4e00, 0x4640, 0x0e40, 0x4c40],
  Z: [0xc600, 0x2640, 0x0c60, 0x4c80],
} as const;

const Colors: Record<ShapesKey, number> = {
  I: 0xaeeeee,
  J: 0x6ba1ff,
  L: 0xfca828,
  O: 0xfcee4e,
  S: 0x98fb98,
  T: 0xd09cff,
  Z: 0xff6961,
} as const;

export function getShape(shapeName: ShapesKey, dir: number) {
  return Shapes[shapeName][dir];
}

export function getColor(shapeName: ShapesKey) {
  return Colors[shapeName];
}

export function eachBlock(
  type: ShapesKey,
  position: Vec2,
  dir: number,
  fn: (x: number, y: number) => void
) {
  let row = 0,
    col = 0;
  let blocks = getShape(type, dir);
  for (let bit = 0x8000; bit > 0; bit = bit >> 1) {
    if (blocks & bit) {
      fn(position.x + col, position.y + row);
    }
    if (++col === 4) {
      col = 0;
      row++;
    }
  }
}

export function isValidMove(
  board: Board,
  piece: ShapesKey,
  position: Vec2,
  dir: number
) {
  const { rows, cols, offField } = GameSettings;

  let valid = true;
  eachBlock(piece, position, dir, (x, y) => {
    const under = y >= rows + offField;
    const toTheLeft = x < 0;
    const toTheRight = x >= cols;

    if (toTheLeft || toTheRight || under || board.getAt(x, y) != "0") {
      valid = false;
      return;
    }
  });
  return valid;
}
