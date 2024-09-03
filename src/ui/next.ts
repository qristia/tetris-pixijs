import { ShapesKey } from "../tetr/shapes";
import { GameSettings } from "../settings";
import { PreviewUI } from "./preview";

export default class NextContainer extends PreviewUI {
  sequence: ShapesKey[];
  previewCount: number;

  constructor(previewCount: number) {
    const offset = 4 + 1;
    const rows = offset * previewCount - 1;
    super("NEXT", rows, 4);

    this.sequence = [];
    this.previewCount = previewCount;

    this.adjustPosition();
  }

  adjustPosition() {
    const { width, height, boardW, boardH, offField, cellSize } = GameSettings;
    this.x = (width + boardW) / 2 + 2 * cellSize;
    this.y = (height - boardH) / 2 - offField * cellSize;
  }

  update(sequence: ShapesKey[]) {
    this.sequence = sequence;

    this.clear();

    this.sequence.forEach((piece, i) => {
      if (i >= this.previewCount) return;
      const offset = 4 - 1;
      this.drawShape(piece, i * offset);
    });
  }
}
