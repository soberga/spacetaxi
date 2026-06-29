import { C64, TILE, SCREEN_W, SCREEN_H } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';

// Grid helpers
const TW = SCREEN_W / TILE;  // 48 tiles wide
const TH = SCREEN_H / TILE;  // 34 tiles tall

function wall(x: number, y: number, w: number, h: number, color: number) {
  return { x: x * TILE, y: y * TILE, width: w * TILE, height: h * TILE, color };
}

// ── Level 1: "Open Sky" — wide-open beginner level ───────────────────────────
const level1: LevelDefinition = {
  id: 1,
  name: 'Open Sky',
  bgColor: C64.BLACK,
  // Start on H pad: H is at tile y=16, so top of ledge is pixel 128.
  // Taxi height = 2 tiles = 16px, so taxi.y = 128 - 16 = 112.
  taxiStart: { x: 3 * TILE, y: 16 * TILE - 2 * TILE },
  walls: [
    // Border
    wall(0, 0, TW, 1,  C64.GREEN),
    wall(0, TH - 1, TW, 1, C64.GREEN),
    wall(0, 0, 1, TH,  C64.GREEN),
    wall(TW - 1, 0, 1, TH, C64.GREEN),

    // H pad ledge — left side, mid-height (wide, attached to left wall)
    wall(1, 16, 8, 2, C64.GREEN),

    // Pad 1 ledge — right side, lower
    wall(38, 22, 9, 2, C64.GREEN),

    // Pad 2 ledge — centre-right, high
    wall(24, 9, 9, 2, C64.GREEN),

    // Pad 3 ledge — centre-left, low
    wall(13, 25, 9, 2, C64.GREEN),
  ],
  pads: [
    { id: 'H', x: 1,  y: 16, width: 7 },
    { id: '1', x: 38, y: 22, width: 8 },
    { id: '2', x: 24, y: 9,  width: 8 },
    { id: '3', x: 13, y: 25, width: 8 },
  ],
  passengers: [
    { padId: '1', destPadId: 'H' },
    { padId: '2', destPadId: '3' },
  ],
};

// ── Level 2: "Mine Level" ─────────────────────────────────────────────────────
const level2: LevelDefinition = {
  id: 2,
  name: 'Mine Level',
  bgColor: C64.BLACK,
  taxiStart: { x: 1 * TILE + 4, y: 12 * TILE - TILE * 2 },
  walls: [
    wall(0, 0, TW, 1, C64.BROWN),
    wall(0, TH - 1, TW, 1, C64.BROWN),
    wall(0, 0, 1, TH, C64.BROWN),
    wall(TW - 1, 0, 1, TH, C64.BROWN),

    // Ceiling stalactites
    wall(6,  1, 2, 5,  C64.BROWN),
    wall(14, 1, 2, 7,  C64.BROWN),
    wall(22, 1, 2, 4,  C64.BROWN),
    wall(30, 1, 2, 6,  C64.BROWN),
    wall(38, 1, 2, 3,  C64.BROWN),

    // Floor stalagmites
    wall(3,  TH - 6, 2, 5, C64.BROWN),
    wall(10, TH - 8, 2, 7, C64.BROWN),
    wall(18, TH - 5, 2, 4, C64.BROWN),
    wall(26, TH - 7, 2, 6, C64.BROWN),
    wall(34, TH - 4, 2, 3, C64.BROWN),
    wall(42, TH - 6, 2, 5, C64.BROWN),

    // Mid-level platforms
    wall(1,  12, 5,  1, C64.LIGHT_RED),
    wall(8,  16, 6,  1, C64.LIGHT_RED),
    wall(16, 10, 6,  1, C64.LIGHT_RED),
    wall(24, 14, 5,  1, C64.LIGHT_RED),
    wall(32, 9,  6,  1, C64.LIGHT_RED),
    wall(40, 13, 6,  1, C64.LIGHT_RED),
  ],
  pads: [
    { id: 'H', x: 1,  y: 12, width: 5 },
    { id: '1', x: 8,  y: 16, width: 5 },
    { id: '2', x: 16, y: 10, width: 5 },
    { id: '3', x: 24, y: 14, width: 4 },
    { id: '4', x: 32, y: 9,  width: 5 },
    { id: '5', x: 40, y: 13, width: 5 },
  ],
  passengers: [
    { padId: '2', destPadId: '5' },
    { padId: '4', destPadId: 'H' },
    { padId: '1', destPadId: '3' },
  ],
};

// ── Level 3: "Space Level" ────────────────────────────────────────────────────
const level3: LevelDefinition = {
  id: 3,
  name: 'Space Station',
  bgColor: C64.BLACK,
  taxiStart: { x: 2 * TILE + 4, y: 6 * TILE - TILE * 2 },
  walls: [
    wall(0, 0, TW, 1, C64.LIGHT_BLUE),
    wall(0, TH - 1, TW, 1, C64.LIGHT_BLUE),
    wall(0, 0, 1, TH, C64.LIGHT_BLUE),
    wall(TW - 1, 0, 1, TH, C64.LIGHT_BLUE),

    // Space station platforms (horizontal modules)
    wall(1,  6,  8, 1, C64.MID_GREY),
    wall(1,  5,  1, 1, C64.MID_GREY),
    wall(8,  5,  1, 1, C64.MID_GREY),

    wall(12, 10, 8, 1, C64.MID_GREY),
    wall(12, 9,  1, 1, C64.MID_GREY),
    wall(19, 9,  1, 1, C64.MID_GREY),

    wall(22, 4,  8, 1, C64.MID_GREY),
    wall(22, 3,  1, 1, C64.MID_GREY),
    wall(29, 3,  1, 1, C64.MID_GREY),

    wall(32, 14, 8, 1, C64.MID_GREY),
    wall(32, 13, 1, 1, C64.MID_GREY),
    wall(39, 13, 1, 1, C64.MID_GREY),

    wall(38, 6,  8, 1, C64.MID_GREY),
    wall(38, 5,  1, 1, C64.MID_GREY),
    wall(45, 5,  1, 1, C64.MID_GREY),

    // Lower platforms
    wall(5,  20, 10, 1, C64.DARK_GREY),
    wall(18, 24, 10, 1, C64.DARK_GREY),
    wall(32, 20, 10, 1, C64.DARK_GREY),

    // Vertical connectors
    wall(9,  14, 1, 7, C64.DARK_GREY),
    wall(24, 18, 1, 7, C64.DARK_GREY),
    wall(38, 14, 1, 7, C64.DARK_GREY),
  ],
  pads: [
    { id: 'H', x: 2,  y: 6,  width: 6 },
    { id: '1', x: 13, y: 10, width: 6 },
    { id: '2', x: 23, y: 4,  width: 6 },
    { id: '3', x: 33, y: 14, width: 6 },
    { id: '4', x: 39, y: 6,  width: 6 },
    { id: '5', x: 5,  y: 20, width: 8 },
    { id: '6', x: 18, y: 24, width: 8 },
    { id: '7', x: 32, y: 20, width: 8 },
  ],
  passengers: [
    { padId: '1', destPadId: '4' },
    { padId: '3', destPadId: 'H' },
    { padId: '5', destPadId: '2' },
    { padId: '6', destPadId: '7' },
  ],
};

export const LEVELS: LevelDefinition[] = [level1, level2, level3];
