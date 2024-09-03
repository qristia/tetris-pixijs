export type ScoreType = { label: string; score: number; difficult: boolean };
type ScoreRecordType = Record<number, ScoreType>;

export const Scores: Record<"Line" | "TSpin" | "MiniTSpin", ScoreRecordType> = {
  Line: {
    0: {
      label: "",
      score: 0,
      difficult: false,
    },
    1: {
      label: "Single",
      score: 100,
      difficult: false,
    },
    2: {
      label: "Double",
      score: 300,
      difficult: false,
    },
    3: {
      label: "Triple",
      score: 500,
      difficult: false,
    },
    4: {
      label: "Quad",
      score: 800,
      difficult: true,
    },
  },
  TSpin: {
    0: {
      label: "T-Spin No Line",
      score: 400,
      difficult: false,
    },
    1: {
      label: "T-Spin Single",
      score: 800,
      difficult: true,
    },
    2: {
      label: "T-Spin Double",
      score: 1200,
      difficult: true,
    },
    3: {
      label: "T-Spin Triple",
      score: 1600,
      difficult: true,
    },
  },
  MiniTSpin: {
    0: {
      label: "Mini T-Spin No Line",
      score: 100,
      difficult: false,
    },
    1: {
      label: "Mini T-Spin Single",
      score: 200,
      difficult: true,
    },
    2: {
      label: "Mini T-Spin Double",
      score: 400,
      difficult: true,
    },
  },
} as const;
