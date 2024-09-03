import { Sprite, Texture } from "pixi.js";
import { LevelsSpeed } from "./settings";

export type Vec2 = { x: number; y: number };

export function random(a: number, b: number): number {
  return Math.random() * (b - a) + a;
}

export function outOfBounds(x: number, y: number, cols: number, rows: number) {
  return x < 0 || y < 0 || x >= cols || y >= rows;
}

export function getSpeed(level: number) {
  return LevelsSpeed[Math.min(level, LevelsSpeed.length - 1)];
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: number | undefined;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func.apply(context, args), wait);
  } as T;
}

export function setTexture(
  sprite: Sprite,
  texture: Texture,
  width: number,
  height: number
) {
  sprite.texture = texture;
  sprite.width = width;
  sprite.height = height;
}
