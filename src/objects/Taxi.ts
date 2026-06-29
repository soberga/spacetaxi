import Phaser from 'phaser';
import {
  C64, TILE, GRAVITY, THRUST, LATERAL_THRUST,
  MAX_SPEED_X, MAX_SPEED_Y, FUEL_THRUST_RATE,
  SAFE_LAND_VY, SAFE_LAND_VX,
} from '../constants.ts';

export class Taxi {
  readonly sprite: Phaser.GameObjects.Graphics;

  vx = 0;
  vy = 0;
  fuel: number;
  isLanded = false;
  facingRight = true;

  // Pixel dimensions
  readonly w = TILE * 3;
  readonly h = TILE * 2;

  constructor(scene: Phaser.Scene, x: number, y: number, fuel: number) {
    this.fuel = fuel;
    this.sprite = scene.add.graphics();
    this.sprite.setPosition(x, y);
    this.draw();
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  set x(v: number) { this.sprite.x = v; }
  set y(v: number) { this.sprite.y = v; }

  private draw() {
    const g = this.sprite;
    g.clear();

    // Taxi body (3x2 tiles)
    // Cab (upper half, centered)
    g.fillStyle(C64.YELLOW);
    g.fillRect(TILE, 0, TILE, TILE);

    // Main body
    g.fillStyle(C64.YELLOW);
    g.fillRect(0, TILE, this.w, TILE);

    // Window
    g.fillStyle(C64.LIGHT_BLUE);
    g.fillRect(TILE + 1, 1, TILE - 2, TILE - 2);

    // Wheels
    g.fillStyle(C64.DARK_GREY);
    g.fillRect(2, this.h - 2, 4, 2);
    g.fillRect(this.w - 6, this.h - 2, 4, 2);

    // Antenna
    g.fillStyle(C64.WHITE);
    g.fillRect(TILE + 3, -3, 2, 3);
  }

  drawThrust() {
    const g = this.sprite;
    // Redraw with thrust flame
    this.draw();
    g.fillStyle(C64.ORANGE);
    const cx = this.w / 2 - 2;
    g.fillRect(cx, this.h, 4, 4);
    g.fillStyle(C64.YELLOW);
    g.fillRect(cx + 1, this.h + 1, 2, 2);
  }

  getBounds(): Phaser.Geom.Rectangle {
    return new Phaser.Geom.Rectangle(this.x, this.y, this.w, this.h);
  }

  // Landing zone: bottom center strip
  getLandingRect(): Phaser.Geom.Rectangle {
    const margin = 4;
    return new Phaser.Geom.Rectangle(
      this.x + margin, this.y + this.h - 1,
      this.w - margin * 2, 2,
    );
  }

  checkSafeLanding(): boolean {
    return Math.abs(this.vy) <= SAFE_LAND_VY && Math.abs(this.vx) <= SAFE_LAND_VX;
  }

  update(dt: number, cursors: Phaser.Types.Input.Keyboard.CursorKeys, thrustKey: Phaser.Input.Keyboard.Key) {
    if (this.isLanded) {
      this.vx = 0;
      this.vy = 0;
      this.draw();
      return;
    }

    let thrusting = false;

    // Vertical thrust (Up or Space)
    if ((cursors.up.isDown || thrustKey.isDown) && this.fuel > 0) {
      this.vy -= THRUST * dt;
      this.fuel = Math.max(0, this.fuel - FUEL_THRUST_RATE * dt);
      thrusting = true;
    }

    // Lateral thrust
    if (cursors.left.isDown && this.fuel > 0) {
      this.vx -= LATERAL_THRUST * dt;
      this.fuel = Math.max(0, this.fuel - FUEL_THRUST_RATE * 0.5 * dt);
      this.facingRight = false;
    }
    if (cursors.right.isDown && this.fuel > 0) {
      this.vx += LATERAL_THRUST * dt;
      this.fuel = Math.max(0, this.fuel - FUEL_THRUST_RATE * 0.5 * dt);
      this.facingRight = true;
    }

    // Gravity
    this.vy += GRAVITY * dt;

    // Clamp speeds
    this.vx = Phaser.Math.Clamp(this.vx, -MAX_SPEED_X, MAX_SPEED_X);
    this.vy = Phaser.Math.Clamp(this.vy, -MAX_SPEED_Y, MAX_SPEED_Y);

    // Drag
    this.vx *= (1 - 0.5 * dt);

    // Move
    this.sprite.x += this.vx * dt;
    this.sprite.y += this.vy * dt;

    // Redraw to show/hide thrust flame
    if (thrusting) {
      this.drawThrust();
    } else {
      this.draw();
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
