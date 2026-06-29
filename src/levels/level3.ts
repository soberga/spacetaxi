import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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
    wall(17, 18, 8, 2, C64.MID_GREY),   // 4  (width 10 → ledge 11)
    wall(32, 23, 14, 2, C64.MID_GREY),   // 5
    wall(11, 28, 16, 2, C64.MID_GREY),   // 6
  ],
  pads: [
    { id: 'H', x: 2,  y: 9,  width: 8  },
    { id: '1', x: 20, y: 8,  width: 8  },
    { id: '2', x: 36, y: 12, width: 10 },
    { id: '3', x: 3,  y: 20, width: 10 },
    { id: '4', x: 17, y: 18, width: 8 },
    { id: '5', x: 32, y: 23, width: 13 },
    { id: '6', x: 11, y: 28, width: 15 },
  ],
  passengers: [
    { padId: '1', destPadId: 'H' },
    { padId: '3', destPadId: '5' },
    { padId: '6', destPadId: '2' },
  ],
};

export default level3;
