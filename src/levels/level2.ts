import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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
    wall(14, 28, 18, 2, C64.BROWN),  // 5  — centre-low float
  ],
  pads: [
    { id: 'H', x: 1,  y: 12, width: 9  },
    { id: '1', x: 1,  y: 25, width: 9  },
    { id: '2', x: 36, y: 8,  width: 10 },
    { id: '3', x: 36, y: 21, width: 10 },
    { id: '5', x: 14, y: 28, width: 17 },
  ],
  passengers: [
    { padId: '2', destPadId: 'H' },
    { padId: '1', destPadId: '3' },
  ],
};

export default level2;
