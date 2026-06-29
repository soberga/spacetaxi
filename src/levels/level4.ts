import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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
    wall(13, 18,  5, 15, C64.LIGHT_RED), // column 1 — pad 1 on top (y=18)
    wall(30, 14,  5, 19, C64.LIGHT_RED), // column 2 — pad 2 on top (y=14)
    wall(20,  1,  4,  9, C64.LIGHT_RED), // overhang A — centre
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

export default level4;
