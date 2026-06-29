import { C64, TILE } from '../constants.ts';
import type { LevelDefinition } from '../types.ts';
import { TW, TH, wall } from './levelUtils.ts';

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

export default level1;
