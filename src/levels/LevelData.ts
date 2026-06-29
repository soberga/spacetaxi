import { C64, TILE, SCREEN_W, SCREEN_H } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';

const TW = SCREEN_W / TILE;  // 48 tiles wide
const TH = SCREEN_H / TILE;  // 34 tiles tall

function wall(x: number, y: number, w: number, h: number, color: number) {
  return { x: x * TILE, y: y * TILE, width: w * TILE, height: h * TILE, color };
}

// ── Level 1: "Open Sky" ───────────────────────────────────────────────────────
const level1: LevelDefinition = {
  id: 1,
  name: 'Open Sky',
  bgColor: C64.BLACK,
  taxiStart: { x: 3 * TILE, y: 16 * TILE - 2 * TILE },
  walls: [
    wall(0, 0, TW, 1,      C64.GREEN),
    wall(0, TH - 1, TW, 1, C64.GREEN),
    wall(0, 0, 1, TH,      C64.GREEN),
    wall(TW - 1, 0, 1, TH, C64.GREEN),
    wall(1,  16, 8, 2, C64.GREEN),
    wall(38, 22, 9, 2, C64.GREEN),
    wall(24, 9,  9, 2, C64.GREEN),
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

// ── Level 2: "Canyon" — wide open, ledges on walls + floating platforms ───────
// H pad tile-y=12 → surface pixel=96. taxiStart.y = 96−16 = 80.
const level2: LevelDefinition = {
  id: 2,
  name: 'Canyon',
  bgColor: C64.BLACK,
  taxiStart: { x: 28, y: 80 },
  walls: [
    wall(0, 0, TW, 1,      C64.ORANGE),
    wall(0, TH - 1, TW, 1, C64.ORANGE),
    wall(0, 0, 1, TH,      C64.ORANGE),
    wall(TW - 1, 0, 1, TH, C64.ORANGE),
    wall(1,  12, 10, 2, C64.BROWN),  // H  — left mid
    wall(1,  25, 10, 2, C64.BROWN),  // 1  — left low
    wall(36,  8, 11, 2, C64.BROWN),  // 2  — right high
    wall(36, 21, 11, 2, C64.BROWN),  // 3  — right mid
    wall(17, 17, 14, 2, C64.BROWN),  // 4  — centre float
    wall(14, 28, 18, 2, C64.BROWN),  // 5  — centre-low float
  ],
  pads: [
    { id: 'H', x: 1,  y: 12, width: 9  },
    { id: '1', x: 1,  y: 25, width: 9  },
    { id: '2', x: 36, y: 8,  width: 10 },
    { id: '3', x: 36, y: 21, width: 10 },
    { id: '4', x: 17, y: 17, width: 13 },
    { id: '5', x: 14, y: 28, width: 17 },
  ],
  passengers: [
    { padId: '2', destPadId: 'H' },
    { padId: '1', destPadId: '3' },
    { padId: '4', destPadId: '5' },
  ],
};

// ── Level 3: "Islands" — scattered floating platforms, no obstacles ────────────
// H pad tile-y=9 → surface pixel=72. taxiStart.y = 72−16 = 56.
const level3: LevelDefinition = {
  id: 3,
  name: 'Islands',
  bgColor: C64.BLACK,
  taxiStart: { x: 36, y: 56 },
  walls: [
    wall(0, 0, TW, 1,      C64.LIGHT_BLUE),
    wall(0, TH - 1, TW, 1, C64.LIGHT_BLUE),
    wall(0, 0, 1, TH,      C64.LIGHT_BLUE),
    wall(TW - 1, 0, 1, TH, C64.LIGHT_BLUE),
    wall(2,   9,  9, 2, C64.MID_GREY),   // H
    wall(20,  8,  9, 2, C64.MID_GREY),   // 1
    wall(36, 12, 11, 2, C64.MID_GREY),   // 2
    wall(3,  20, 11, 2, C64.MID_GREY),   // 3
    wall(17, 18, 13, 2, C64.MID_GREY),   // 4
    wall(32, 23, 14, 2, C64.MID_GREY),   // 5
    wall(11, 28, 16, 2, C64.MID_GREY),   // 6
  ],
  pads: [
    { id: 'H', x: 2,  y: 9,  width: 8  },
    { id: '1', x: 20, y: 8,  width: 8  },
    { id: '2', x: 36, y: 12, width: 10 },
    { id: '3', x: 3,  y: 20, width: 10 },
    { id: '4', x: 17, y: 18, width: 12 },
    { id: '5', x: 32, y: 23, width: 13 },
    { id: '6', x: 11, y: 28, width: 15 },
  ],
  passengers: [
    { padId: '1', destPadId: 'H' },
    { padId: '3', destPadId: '5' },
    { padId: '6', destPadId: '2' },
  ],
};

// ── Level 4: "Columns" — floor columns carve vertical corridors ───────────────
// H pad tile-y=10 → surface pixel=80. taxiStart.y = 80−16 = 64.
// Columns: wall(13,18,5,15) and wall(30,14,5,19). Corridors left/centre/right ≥96 px.
// taxiStart at x=28 is within left corridor (x=8..104), clear of both columns.
const level4: LevelDefinition = {
  id: 4,
  name: 'Columns',
  bgColor: C64.BLACK,
  taxiStart: { x: 28, y: 64 },
  walls: [
    wall(0, 0, TW, 1,      C64.RED),
    wall(0, TH - 1, TW, 1, C64.RED),
    wall(0, 0, 1, TH,      C64.RED),
    wall(TW - 1, 0, 1, TH, C64.RED),
    wall(1,  10, 10, 2, C64.LIGHT_RED),  // H  — left mid
    wall(1,  24,  8, 2, C64.LIGHT_RED),  // 3  — left low
    wall(37,  8, 10, 2, C64.LIGHT_RED),  // 4  — right high
    wall(37, 21, 10, 2, C64.LIGHT_RED),  // 5  — right low
    wall(19, 11, 10, 2, C64.LIGHT_RED),  // 6  — float centre-upper
    wall(13, 18,  5, 15, C64.LIGHT_RED), // column 1 — pad 1 lands on top (y=18)
    wall(30, 14,  5, 19, C64.LIGHT_RED), // column 2 — pad 2 lands on top (y=14)
    wall(20,  1,  4,  9, C64.LIGHT_RED), // overhang A — centre (x=160..192, clears taxiStart)
    wall(37,  1,  4,  8, C64.LIGHT_RED), // overhang B — right
  ],
  pads: [
    { id: 'H', x: 1,  y: 10, width: 9 },
    { id: '1', x: 13, y: 18, width: 5 },
    { id: '2', x: 30, y: 14, width: 5 },
    { id: '3', x: 1,  y: 24, width: 7 },
    { id: '4', x: 37, y: 8,  width: 9 },
    { id: '5', x: 37, y: 21, width: 9 },
    { id: '6', x: 19, y: 11, width: 9 },
  ],
  passengers: [
    { padId: '2', destPadId: 'H' },
    { padId: '3', destPadId: '4' },
    { padId: '5', destPadId: '1' },
    { padId: '6', destPadId: '3' },
  ],
};

// ── Level 5: "Zigzag" — platforms alternate left/right forcing diagonal runs ───
// H pad tile-y=6 → surface pixel=48. taxiStart.y = 48−16 = 32.
const level5: LevelDefinition = {
  id: 5,
  name: 'Zigzag',
  bgColor: C64.BLACK,
  taxiStart: { x: 28, y: 32 },
  walls: [
    wall(0, 0, TW, 1,      C64.PURPLE),
    wall(0, TH - 1, TW, 1, C64.PURPLE),
    wall(0, 0, 1, TH,      C64.PURPLE),
    wall(TW - 1, 0, 1, TH, C64.PURPLE),
    wall(1,   6, 10, 2, C64.LIGHT_BLUE),  // H  — left top
    wall(37, 11, 10, 2, C64.LIGHT_BLUE),  // 1  — right upper
    wall(1,  15, 10, 2, C64.LIGHT_BLUE),  // 2  — left mid-upper
    wall(37, 19, 10, 2, C64.LIGHT_BLUE),  // 3  — right mid
    wall(1,  23, 10, 2, C64.LIGHT_BLUE),  // 4  — left mid-lower
    wall(37, 27, 10, 2, C64.LIGHT_BLUE),  // 5  — right low
    wall(14, 11, 12, 2, C64.LIGHT_BLUE),  // 6  — float upper-centre
    wall(21, 22, 11, 2, C64.LIGHT_BLUE),  // 7  — float lower-centre
  ],
  pads: [
    { id: 'H', x: 1,  y: 6,  width: 9  },
    { id: '1', x: 37, y: 11, width: 9  },
    { id: '2', x: 1,  y: 15, width: 9  },
    { id: '3', x: 37, y: 19, width: 9  },
    { id: '4', x: 1,  y: 23, width: 9  },
    { id: '5', x: 37, y: 27, width: 9  },
    { id: '6', x: 14, y: 11, width: 11 },
    { id: '7', x: 21, y: 22, width: 10 },
  ],
  passengers: [
    { padId: '1', destPadId: '4' },
    { padId: '2', destPadId: '5' },
    { padId: '6', destPadId: '3' },
    { padId: '7', destPadId: 'H' },
  ],
};

// ── Level 6: "Endgame" — 8 pads, 5 passengers, maximum complexity ─────────────
// H pad tile-y=8 → surface pixel=64. taxiStart.y = 64−16 = 48.
const level6: LevelDefinition = {
  id: 6,
  name: 'Endgame',
  bgColor: C64.BLACK,
  taxiStart: { x: 28, y: 48 },
  walls: [
    wall(0, 0, TW, 1,      C64.CYAN),
    wall(0, TH - 1, TW, 1, C64.CYAN),
    wall(0, 0, 1, TH,      C64.CYAN),
    wall(TW - 1, 0, 1, TH, C64.CYAN),
    wall(1,   8, 10, 2, C64.LIGHT_GREEN), // H
    wall(17,  5, 10, 2, C64.LIGHT_GREEN), // 1  — float upper-centre
    wall(33,  8, 13, 2, C64.LIGHT_GREEN), // 2  — right upper
    wall(37, 15, 10, 2, C64.LIGHT_GREEN), // 3  — right mid
    wall(17, 16, 12, 2, C64.LIGHT_GREEN), // 4  — float centre
    wall(3,  19, 11, 2, C64.LIGHT_GREEN), // 5  — left mid-low
    wall(29, 23, 17, 2, C64.LIGHT_GREEN), // 6  — float lower-right wide
    wall(1,  27, 10, 2, C64.LIGHT_GREEN), // 7  — left low
    wall(14, 28, 14, 2, C64.LIGHT_GREEN), // 8  — float lower-centre
  ],
  pads: [
    { id: 'H', x: 1,  y: 8,  width: 9  },
    { id: '1', x: 17, y: 5,  width: 9  },
    { id: '2', x: 33, y: 8,  width: 12 },
    { id: '3', x: 37, y: 15, width: 9  },
    { id: '4', x: 17, y: 16, width: 11 },
    { id: '5', x: 3,  y: 19, width: 10 },
    { id: '6', x: 29, y: 23, width: 16 },
    { id: '7', x: 1,  y: 27, width: 9  },
    { id: '8', x: 14, y: 28, width: 13 },
  ],
  passengers: [
    { padId: '1', destPadId: '6' },
    { padId: '3', destPadId: '5' },
    { padId: '4', destPadId: '7' },
    { padId: '6', destPadId: 'H' },
    { padId: '8', destPadId: '3' },
  ],
};

export const LEVELS: LevelDefinition[] = [level1, level2, level3, level4, level5, level6];
