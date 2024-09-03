import { Container, Text, TextStyle, Texture } from "pixi.js";
import { GameSettings } from "../settings";
import { ShapesKey, eachBlock } from "../tetr/shapes";
import BaseContainer from "../baseContainer";
import { setTexture } from "../utils";

const defaultTextStyle = new TextStyle({
  fontFamily: "MixBit",
  fontSize: 20,
  fill: "#fff",
  stroke: "#000000",
});

export class PreviewUI extends Container {
  blocksContainer: BaseContainer;
  title: Text;

  constructor(titleText: string, rows: number, cols: number) {
    super();
    const { cellSize } = GameSettings;

    this.blocksContainer = new BaseContainer(rows, cols, 0, cellSize);
    this.title = new Text({ text: titleText, style: defaultTextStyle });

    this.addChild(this.blocksContainer);
    this.addChild(this.title);
  }

  clear() {
    this.blocksContainer.clear();
  }

  drawShape(piece: ShapesKey, y = 0) {
    const { cellSize } = GameSettings;

    eachBlock(piece, { x: 0, y }, 0, (x, y) => {
      const spr = this.blocksContainer.sprites[y][x];
      setTexture(spr, Texture.from(piece), cellSize, cellSize);
      if (piece !== "I" && piece !== "O") {
        spr.x += cellSize / 2;
      }
      if (piece === "I") {
        spr.y -= cellSize / 2;
      }
    });
  }
}
