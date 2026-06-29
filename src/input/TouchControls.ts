import Phaser from 'phaser';
import { C64, SCREEN_W, SCREEN_H } from '../constants.ts';
import type { VirtualInput } from '../types.ts';

const BTN_W = 64;
const BTN_H = 44;
const BTN_Y = SCREEN_H - BTN_H;
const ALPHA = 0.40;

export class TouchControls {
  readonly input: VirtualInput = { left: false, right: false, thrust: false };

  private readonly leftRect   = new Phaser.Geom.Rectangle(4,                      BTN_Y, BTN_W, BTN_H);
  private readonly thrustRect = new Phaser.Geom.Rectangle(SCREEN_W / 2 - BTN_W / 2, BTN_Y, BTN_W, BTN_H);
  private readonly rightRect  = new Phaser.Geom.Rectangle(SCREEN_W - BTN_W - 4,   BTN_Y, BTN_W, BTN_H);

  private gfx: Phaser.GameObjects.Graphics;
  private labelLeft!: Phaser.GameObjects.Text;
  private labelThrust!: Phaser.GameObjects.Text;
  private labelRight!: Phaser.GameObjects.Text;

  constructor(private scene: Phaser.Scene) {
    this.gfx = scene.add.graphics().setDepth(50);
    this.drawButtons();

    const style = { fontFamily: 'monospace', fontSize: '14px', color: '#ffffff' };
    const mk = (ch: string, r: Phaser.Geom.Rectangle) =>
      scene.add.text(r.centerX, r.centerY, ch, style)
        .setOrigin(0.5).setDepth(51).setAlpha(0.85);

    this.labelLeft   = mk('◄', this.leftRect);
    this.labelThrust = mk('▲', this.thrustRect);
    this.labelRight  = mk('►', this.rightRect);
  }

  private drawButtons() {
    const g = this.gfx;
    g.clear();

    const draw = (rect: Phaser.Geom.Rectangle, active: boolean) => {
      g.fillStyle(active ? C64.YELLOW : C64.MID_GREY, ALPHA);
      g.fillRect(rect.x, rect.y, rect.width, rect.height);
      g.lineStyle(1, C64.WHITE, ALPHA + 0.2);
      g.strokeRect(rect.x, rect.y, rect.width, rect.height);
    };

    draw(this.leftRect,   this.input.left);
    draw(this.thrustRect, this.input.thrust);
    draw(this.rightRect,  this.input.right);
  }

  update() {
    this.input.left   = false;
    this.input.right  = false;
    this.input.thrust = false;

    const ptrs = this.scene.input.manager.pointers;
    for (const ptr of ptrs) {
      if (!ptr.isDown) continue;
      if (this.leftRect.contains(ptr.x, ptr.y))   this.input.left   = true;
      if (this.thrustRect.contains(ptr.x, ptr.y)) this.input.thrust = true;
      if (this.rightRect.contains(ptr.x, ptr.y))  this.input.right  = true;
    }

    this.drawButtons();
  }

  destroy() {
    this.gfx.destroy();
    this.labelLeft.destroy();
    this.labelThrust.destroy();
    this.labelRight.destroy();
  }
}
