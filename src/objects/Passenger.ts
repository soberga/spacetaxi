import Phaser from 'phaser';
import { C64, TILE } from '../constants.ts';
import type { PassengerState } from '../types.ts';

const WALK_SPEED = 18; // px/s
const BOARD_DIST = TILE * 1.5;

export class Passenger {
  private gfx: Phaser.GameObjects.Graphics;
  private label: Phaser.GameObjects.Text;
  readonly state: PassengerState;

  // Destination the passenger announces (e.g. "pad 3" → "3!")
  readonly calloutText: string;

  constructor(scene: Phaser.Scene, state: PassengerState) {
    this.state = state;
    this.calloutText = state.destPad === 'H' ? 'Home pad!' : `Pad ${state.destPad}!`;

    this.gfx = scene.add.graphics();
    this.label = scene.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#ffffff',
    }).setDepth(10);

    this.draw();
    this.updateLabelPos();
  }

  get x() { return this.state.x; }
  get y() { return this.state.y; }

  private draw() {
    const g = this.gfx;
    g.clear();
    g.setPosition(this.state.x, this.state.y);

    if (this.state.state === 'aboard' || this.state.state === 'delivered') return;

    // Simple C64-style person: head + body
    const color = this.state.state === 'waiting' ? C64.CYAN : C64.LIGHT_GREEN;

    // Head
    g.fillStyle(color);
    g.fillRect(-2, -10, 5, 5);

    // Body
    g.fillStyle(color);
    g.fillRect(-2, -5, 5, 6);

    // Legs
    g.fillRect(-3, 1, 2, 4);
    g.fillRect(2, 1, 2, 4);
  }

  private updateLabelPos() {
    if (this.state.state === 'waiting') {
      this.label.setPosition(this.state.x - 10, this.state.y - 22);
      this.label.setText(this.calloutText);
      this.label.setVisible(true);
    } else {
      this.label.setVisible(false);
    }
  }

  showCallout() {
    this.label.setVisible(true);
  }

  hideCallout() {
    this.label.setVisible(false);
  }

  // Returns true when boarding animation is complete
  updateBoarding(taxiX: number, _taxiY: number, dt: number): boolean {
    const targetX = taxiX + TILE * 1.5;
    const dx = targetX - this.state.x;
    if (Math.abs(dx) < 2) {
      this.state.state = 'aboard';
      this.draw();
      this.label.setVisible(false);
      return true;
    }
    this.state.x += Math.sign(dx) * WALK_SPEED * dt;
    this.draw();
    return false;
  }

  // Returns true when alighting animation is complete
  updateAlighting(padX: number, padY: number, dt: number): boolean {
    const targetX = padX + TILE * 2;
    const dx = targetX - this.state.x;
    if (Math.abs(dx) < 2) {
      this.state.state = 'delivered';
      this.gfx.destroy();
      this.label.destroy();
      return true;
    }
    this.state.x += Math.sign(dx) * WALK_SPEED * dt;
    this.state.y = padY;
    this.draw();
    return false;
  }

  isNearTaxi(taxiX: number, taxiY: number): boolean {
    const dx = taxiX - this.state.x;
    const dy = taxiY - this.state.y;
    return Math.abs(dx) < BOARD_DIST * 2 && Math.abs(dy) < TILE * 2;
  }

  destroy() {
    this.gfx.destroy();
    this.label.destroy();
  }
}
