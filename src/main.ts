import { Application, Assets } from "pixi.js";
import { gameLoop, gameSetup } from "./game";
import { debounce } from "./utils";
import { GameSettings } from "./settings";

export const app = new Application();

async function loadAssets() {
  await Assets.load("../assets/pieces.json");
  await Assets.load({ alias: "grid", src: "../assets/grid.png" });
  await Assets.load({
    alias: "MixBit",
    src: "../assets/fonts/MixBit.ttf",
  });
}

async function init() {
  const { width, height } = GameSettings;

  await app.init({
    background: "#000",
    width: width,
    height: height,
    antialias: true,
    autoDensity: true,
    resolution: window.devicePixelRatio || 1,
  });
  document.body.appendChild(app.canvas);

  await loadAssets();

  gameSetup(app);
  app.ticker.add(gameLoop);
}

function adjustSizes() {
  const { cols, rows, offField } = GameSettings;
  const fullRows = rows + offField;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const cellSize = Math.floor((Math.min(w, h) / (fullRows + 1)) * 0.9);

  GameSettings.cellSize = cellSize;
  GameSettings.width = w;
  GameSettings.height = h;
  GameSettings.boardW = cellSize * cols;
  GameSettings.boardH = cellSize * rows;
}

window.addEventListener("resize", debounce(onResize, 150));

function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pw = GameSettings.width;
  const ph = GameSettings.height;

  const scale = Math.min(width / pw, height / ph);
  app.renderer.resize(width, height);
  app.stage.scale.set(scale);

  app.stage.x = (width - pw * scale) / 2;
  app.stage.y = (height - ph * scale) / 2;
}

adjustSizes();
init();
