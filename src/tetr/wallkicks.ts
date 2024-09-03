import { Mino } from "./mino";
import { Vec2 } from "../utils";
import { isValidMove } from "./shapes";

type KickTable = Record<"Table" | "ITable", Record<string, [number, number][]>>;

export function wallkick(
  kickTable: KickTable,
  mino: Mino,
  nextRotation: number
): { pos: Vec2; kick: number } | null {
  const key = mino.rotation + "" + nextRotation;
  const table =
    mino.name === "I" ? kickTable.ITable[key] : kickTable.Table[key];

  for (let i = 0; i < table.length; i++) {
    const pos = {
      x: mino.position.x + table[i][0],
      y: mino.position.y - table[i][1],
    };

    if (isValidMove(mino.game.board, mino.name, pos, nextRotation)) {
      return { pos, kick: i };
    }
  }
  return null;
}

// prettier-ignore
export const SRS_Wallkick: KickTable = {
  // 0 = spawn state, 1 = R, 2 = 180, 3 = L
  Table: {
    "01": [[0,0], [-1, 0], [-1, 1], [0,-2], [-1,-2]],
    "10": [[0,0], [1, 0], [1,-1], [0, 2], [1, 2]],
    "12": [[0,0], [1, 0], [1,-1], [0, 2], [1, 2]],
    "21": [[0,0], [-1, 0], [-1, 1], [0,-2], [-1,-2]],

    "23": [[0,0], [1, 0], [1, 1], [0,-2], [1,-2]],
    "32": [[0,0], [-1, 0], [-1,-1], [0, 2], [-1, 2]],
    "30": [[0,0], [-1, 0], [-1,-1], [0, 2], [-1, 2]],
    "03": [[0,0], [1, 0], [1, 1], [0,-2], [1,-2]],
  },

  ITable: {
    "01": [[0, 0], [-2, 0], [1, 0], [-2,-1], [1, 2]],
    "10": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1,-2]],
    "12": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2,-1]],
    "21": [[0, 0], [1, 0], [-2, 0], [1,-2], [-2, 1]],

    "23": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1,-2]],
    "32": [[0, 0], [-2, 0], [1, 0], [-2,-1], [1, 2]],
    "30": [[0, 0], [1, 0], [-2, 0], [1,-2], [-2, 1]],
    "03": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2,-1]]
  },
};
