import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

// H pad tile-y=8 → surface pixel=64. taxiStart.y = 64−16 = 48.
// Pads arranged in a loose circuit: upper-left → upper-centre → upper-right →
// right-mid → lower-centre → lower-left → left-mid → back to H.
const level4: LevelDefinition = {
  id: 4,
  name: 'Circuit',
  bgColor: C64.BLACK,
  taxiStart: { x: 28, y: 48 },
  walls: [
    wall(0, 0, TW, 1,      C64.YELLOW),
    wall(0, TH - 1, TW, 1, C64.YELLOW),
    wall(0, 0, 1, TH,      C64.YELLOW),
    wall(TW - 1, 0, 1, TH, C64.YELLOW),
    wall(1,   8,  9, 2, C64.LIGHT_GREY),  // H  — left upper
    wall(18,  8, 10, 2, C64.LIGHT_GREY),  // 1  — upper centre
    wall(36,  8, 11, 2, C64.LIGHT_GREY),  // 2  — right upper
    wall(38, 17,  9, 2, C64.LIGHT_GREY),  // 3  — right mid
    wall(21, 26, 12, 2, C64.LIGHT_GREY),  // 4  — lower centre
    wall(3,  27, 10, 2, C64.LIGHT_GREY),  // 5  — left lower
    wall(3,  17,  9, 2, C64.LIGHT_GREY),  // 6  — left mid
  ],
  pads: [
    { id: 'H', x: 1,  y: 8,  width: 8  },
    { id: '1', x: 18, y: 8,  width: 9  },
    { id: '2', x: 36, y: 8,  width: 10 },
    { id: '3', x: 38, y: 17, width: 8  },
    { id: '4', x: 21, y: 26, width: 11 },
    { id: '5', x: 3,  y: 27, width: 9  },
    { id: '6', x: 3,  y: 17, width: 8  },
  ],
  passengers: [
    { padId: '1', destPadId: '4' },
    { padId: '2', destPadId: '6' },
    { padId: '3', destPadId: 'H' },
    { padId: '5', destPadId: '2' },
  ],
};

export default level4;
