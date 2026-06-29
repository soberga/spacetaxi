import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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

export default level5;
