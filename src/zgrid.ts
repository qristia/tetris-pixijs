import { Application, Graphics } from "pixi.js";
import { GameSettings } from "./settings";

export function drawGrid(c: number, w: number, h: number) {
  const grid = new Graphics();
  for (let x = 1; x < w; x++) {
    grid.moveTo(x * (c - 1), 0);
    grid.lineTo(x * (c - 1), h * c - h);
  }

  for (let y = 1; y < h; y++) {
    grid.moveTo(0, y * (c - 1));
    grid.lineTo(w * c - w, y * (c - 1));
  }
  grid.stroke(0xffffff);
  return grid;
}

function download(grid: Graphics, app: Application) {
  app.renderer.extract.canvas(grid).toBlob!((blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob!);
    link.download = "grid.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

export function getGrid(app: Application) {
  const { cellSize, rows, cols } = GameSettings;
  const grid = drawGrid(cellSize, cols, rows);
  download(grid, app);
}
