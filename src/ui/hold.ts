import { ShapesKey } from "../tetr/shapes";
import { GameSettings } from "../settings";
import { PreviewUI } from "./preview";

export default class HoldContainer extends PreviewUI {
  hold: ShapesKey | null;

  constructor() {
    super("HOLD", 4, 4);
    this.hold = null;

    this.adjustPosition();
  }

  adjustPosition() {
    const { width, height, boardW, boardH, offField, cellSize } = GameSettings;
    this.x = (width - boardW) / 2 - (4 + 2) * cellSize;
    this.y = (height - boardH) / 2 - offField * cellSize;
  }

  update(piece: ShapesKey) {
    if (piece === this.hold) return;
    this.hold = piece;
    this.clear();
    this.drawShape(this.hold);
  }
}
