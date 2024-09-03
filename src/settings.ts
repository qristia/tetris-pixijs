export const GameSettings = {
  cellSize: 30,
  cols: 10,
  rows: 20,
  offField: 2,

  width: 800,
  height: 600,

  boardW: 300,
  boardH: 360,

  previewCount: 5,
  maxLockCancels: 15,
  lockDelay: 500, // ms
};

export const UserSettings = {
  ARR: 0,
  DAS: 153,
  SDF: 4000000,
};

export const LevelsSpeed = [
  0.0167, 0.021017, 0.026977, 0.035256, 0.04693, 0.06361, 0.0879, 0.1236,
  0.1775, 0.2598, 0.388, 0.59, 0.92, 1.46, 2.36,
] as const;
