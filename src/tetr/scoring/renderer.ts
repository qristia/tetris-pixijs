import { Text, TextStyle } from "pixi.js";
import { Tetris } from "../tetris";

export function renderScoreText(
  game: Tetris,
  score: string,
  combo: number,
  b2bCombo: number
) {
  console.log({ combo, b2bCombo });
  scoringText.text = score;
  scoringComboText.text = `x${combo}`;
  scoringB2BComboText.text = `B2B x${b2bCombo}`;
  if (!added) {
    const x = game.renderer.x - 20;
    const y = game.renderer.height / 2;
    const offset = 30;

    scoringText.x = x;
    scoringText.y = y;

    scoringText.style.fill = "#ffffff";
    scoringText.anchor.set(1, 0);

    scoringComboText.x = x;
    scoringComboText.y = y + offset;
    scoringComboText.style.fill = "#ffffff";
    scoringComboText.anchor.set(1, 0);

    scoringB2BComboText.x = x;
    scoringB2BComboText.y = y + offset * 2;
    scoringB2BComboText.style.fill = "#ffffff";
    scoringB2BComboText.anchor.set(1, 0);

    game.app.stage.addChild(scoringText);
    game.app.stage.addChild(scoringComboText);
    game.app.stage.addChild(scoringB2BComboText);
    added = true;
  }
}

let added = false;
const scoringTextStyle = new TextStyle({
  fontFamily: "MixBit",
});

const scoringText = new Text({
  text: "Hello",
  style: scoringTextStyle,
});

const scoringComboText = new Text({
  text: "combo",
  style: scoringTextStyle,
});

const scoringB2BComboText = new Text({
  text: "b2bcombo",
  style: scoringTextStyle,
});
