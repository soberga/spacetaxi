export interface PadDefinition {
  id: string;          // '1'-'9' or 'H' (Hey pad)
  x: number;           // tile column
  y: number;           // tile row (top of pad surface)
  width: number;       // in tiles
}

export interface WallDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
}

export interface PassengerSpawn {
  padId: string;
  destPadId: string;
}

export interface LevelDefinition {
  id: number;
  name: string;
  bgColor: number;
  walls: WallDefinition[];
  pads: PadDefinition[];
  passengers: PassengerSpawn[];
  taxiStart: { x: number; y: number };
}

export interface PassengerState {
  id: number;
  sourcePad: string;
  destPad: string;
  state: 'waiting' | 'boarding' | 'aboard' | 'alighting' | 'delivered';
  x: number;
  y: number;
  walkDir: number;
}

export type GamePhase = 'playing' | 'dead' | 'levelcomplete' | 'gameover';
