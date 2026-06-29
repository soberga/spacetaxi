// C64 color palette (16 colors)
export const C64 = {
  BLACK:      0x000000,
  WHITE:      0xffffff,
  RED:        0x883332,
  CYAN:       0x67b6bd,
  PURPLE:     0x8b3f96,
  GREEN:      0x55a049,
  BLUE:       0x40318d,
  YELLOW:     0xbfce72,
  ORANGE:     0x8b5429,
  BROWN:      0x574200,
  LIGHT_RED:  0xb86962,
  DARK_GREY:  0x505050,
  MID_GREY:   0x787878,
  LIGHT_GREEN:0x94e089,
  LIGHT_BLUE: 0x7869c4,
  LIGHT_GREY: 0x9f9f9f,
} as const;

// Game canvas dimensions (C64 was 320x200 but we'll scale to 2x: 640x400)
export const SCREEN_W = 384;
export const SCREEN_H = 272;
export const SCALE = 2;

// Tile/cell size matching C64 character cells (8x8)
export const TILE = 8;

// Physics
export const GRAVITY = 70;           // pixels/s²
export const THRUST = 280;           // pixels/s² upward
export const LATERAL_THRUST = 180;   // pixels/s²
export const MAX_SPEED_X = 140;
export const MAX_SPEED_Y = 160;
export const SAFE_LAND_VY = 110;     // max vertical speed for safe landing
export const SAFE_LAND_VX = 90;      // max horizontal speed for safe landing

// Fuel
export const FUEL_MAX = 999;
export const FUEL_THRUST_RATE = 60;  // units/s when thrusting

// Scoring
export const SCORE_PICKUP = 50;
export const SCORE_DELIVERY_BASE = 100;
export const SCORE_FUEL_BONUS = 1;

// Physics update step
export const PHYSICS_DT = 1 / 60;
