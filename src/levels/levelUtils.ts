import { TILE, SCREEN_W, SCREEN_H } from '../constants.ts';

export const TW = SCREEN_W / TILE;  // 48 tiles wide
export const TH = SCREEN_H / TILE;  // 34 tiles tall

export function wall(x: number, y: number, w: number, h: number, color: number) {
  return { x: x * TILE, y: y * TILE, width: w * TILE, height: h * TILE, color };
}
