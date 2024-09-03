import { game } from "./game";
import { UserSettings } from "./settings";
let _currentKey = "";

const _defaultKeys = {
  exit: "escape",
  retry: "r",
  move_left: "arrowleft",
  move_right: "arrowright",
  swap_hold1: "shift",
  swap_hold2: "",
  soft_drop: "arrowdown",
  hard_drop: " ",
  rotate_180: "z",
  rotate_ccw: "x",
  rotate_cw1: "arrowup",
  rotate_cw2: "c",
} as const;

let _Keys = { ..._defaultKeys };

let _KeysFun: any = {};
let _KeysFunRelease: any = {};
let keysToDebounce: any = {};

updateKeys();

function updateKeys(newKeys = _defaultKeys) {
  _Keys = { ...newKeys };

  keysToDebounce = {
    [newKeys.move_left]: {
      pressing: false,
      startPressingTime: 0,
      pressingTime: 0,
    },
    [newKeys.move_right]: {
      pressing: false,
      startPressingTime: 0,
      pressingTime: 0,
    },
    [newKeys.retry]: {
      pressing: false,
      startPressingTime: 0,
      pressingTime: 0,
    },
  };

  _KeysFun = {
    [newKeys.swap_hold1]: () => {
      game.swapHold();
    },
    [newKeys.swap_hold2]: () => {
      game.swapHold();
    },
    [newKeys.hard_drop]: () => {
      game.hardDrop();
    },
    [newKeys.soft_drop]: () => {
      game.softDrop(true);
    },
    [newKeys.move_left]: () => {
      if (_canMove(newKeys.move_left)) game.move(-1);
    },
    [newKeys.move_right]: () => {
      if (_canMove(newKeys.move_right)) game.move(1);
    },
    [newKeys.rotate_180]: () => {
      game.currentPiece!.rotate("R180");
    },
    [newKeys.rotate_cw1]: () => {
      game.currentPiece.rotate("Clockwise");
    },
    [newKeys.rotate_cw2]: () => {
      game.currentPiece.rotate("Clockwise");
    },
    [newKeys.rotate_ccw]: () => {
      game.currentPiece.rotate("CounterClockwise");
    },
    [newKeys.retry]: () => {
      const { startPressingTime, pressingTime } = keysToDebounce[newKeys.retry];
      if (pressingTime - startPressingTime > 400) {
        keysToDebounce[newKeys.retry].pressing = false;
      }
    },
    [newKeys.exit]: () => {},
  };

  _KeysFunRelease = {
    [newKeys.soft_drop]: () => {
      game.softDrop(false);
    },
  };
}

function _canMove(key: string) {
  const oppositeKey =
    key === _Keys.move_left ? _Keys.move_right : _Keys.move_left;
  if (keysToDebounce[key].pressing && keysToDebounce[oppositeKey].pressing) {
    return _currentKey === key;
  }

  return true;
}

export function handleKeys() {
  const { ARR, DAS } = UserSettings;
  for (const _key in keysToDebounce) {
    const key = keysToDebounce[_key];
    if (!key.pressing) continue;

    const { startPressingTime, pressingTime } = key;

    const now = performance.now();
    const delta = now - pressingTime;
    const deltaStart = now - startPressingTime;
    if (deltaStart < DAS || delta < ARR) continue;

    execKeyFun(_key);
    key.pressingTime = performance.now();
  }
}

function execKeyFun(key: string) {
  const keyFun = _KeysFun[key];
  if (keyFun) keyFun();
}

function keyPressed(key: string) {
  key = key.toLocaleLowerCase();
  _currentKey = key;
  const keyToDebounce = keysToDebounce[key];
  if (keyToDebounce) {
    if (keyToDebounce.pressing) return;
    keyToDebounce.pressing = true;
    keyToDebounce.startPressingTime = performance.now();
    execKeyFun(key);
  } else {
    execKeyFun(key);
  }
}

function keyReleased(key: string) {
  key = key.toLocaleLowerCase();
  if (keysToDebounce[key]) {
    keysToDebounce[key].pressing = false;
  }

  const keyRelease = _KeysFunRelease[key];
  if (keyRelease) keyRelease();

  return false;
}

document.addEventListener("keydown", (ev) => keyPressed(ev.key));
document.addEventListener("keyup", (ev) => keyReleased(ev.key));
