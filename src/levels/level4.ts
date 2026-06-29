import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

// H pad tile-y=9 → surface pixel=72. taxiStart.y = 72−16 = 56.
// Tower A: pixel x=80–120, Tower B: x=264–304.
// Three vertical corridors: left 72 px, centre 144 px, right 72 px.
const level4: LevelDefinition = {
  id: 4,
  name: 'Towers',
  bgColor: C64.BLACK,
  taxiStart: { x: 24, y: 56 },
  walls: [
    wall(0, 0, TW, 1,      C64.YELLOW),
    wall(0, TH - 1, TW, 1, C64.YELLOW),
    wall(0, 0, 1, TH,      C64.YELLOW),
    wall(TW - 1, 0, 1, TH, C64.YELLOW),
    wall(1,   9,  8, 2, C64.LIGHT_GREY),  // H  — left upper
    wall(1,  21,  7, 2, C64.LIGHT_GREY),  // 3  — left lower
    wall(40,  8,  7, 2, C64.LIGHT_GREY),  // 4  — right upper
    wall(40, 22,  7, 2, C64.LIGHT_GREY),  // 5  — right lower
    wall(19, 17, 11, 2, C64.LIGHT_GREY),  // 6  — centre float
    wall(10, 10,  5, 23, C64.MID_GREY),   // Tower A — pad 1 on top (y=10)
    wall(33, 14,  5, 19, C64.MID_GREY),   // Tower B — pad 2 on top (y=14)
  ],
  pads: [
    { id: 'H', x: 1,  y: 9,  width: 7  },
    { id: '1', x: 10, y: 10, width: 5  },
    { id: '2', x: 33, y: 14, width: 5  },
    { id: '3', x: 1,  y: 21, width: 6  },
    { id: '4', x: 40, y: 8,  width: 6  },
    { id: '5', x: 40, y: 22, width: 6  },
    { id: '6', x: 19, y: 17, width: 10 },
  ],
  passengers: [
    { padId: '2', destPadId: 'H'  },
    { padId: '4', destPadId: '1'  },
    { padId: '5', destPadId: '3'  },
    { padId: '6', destPadId: '2'  },
  ],
};

export default level4;
