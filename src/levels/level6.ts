import { C64 } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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
    wall(33,  8, 13, 2, C64.LIGHT_GREEN), // 2  — right upper
    wall(17, 16, 12, 2, C64.LIGHT_GREEN), // 4  — float centre
    wall(29, 23, 17, 2, C64.LIGHT_GREEN), // 6  — float lower-right wide
    wall(1,  27, 10, 2, C64.LIGHT_GREEN), // 7  — left low
    wall(14, 28, 14, 2, C64.LIGHT_GREEN), // 8  — float lower-centre
  ],
  pads: [
    { id: 'H', x: 1,  y: 8,  width: 9  },
    { id: '2', x: 33, y: 8,  width: 12 },
    { id: '4', x: 17, y: 16, width: 11 },
    { id: '6', x: 29, y: 23, width: 16 },
    { id: '7', x: 1,  y: 27, width: 9  },
    { id: '8', x: 14, y: 28, width: 13 },
  ],
  passengers: [
    { padId: '4', destPadId: '7' },
    { padId: '6', destPadId: 'H' },
    { padId: '2', destPadId: '8' },
  ],
};

export default level6;
