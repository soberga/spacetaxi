import Phaser from 'phaser';
import { C64, SCREEN_W } from '../constants.ts';

export class TitleScene extends Phaser.Scene {
  private blinkTimer = 0;
  private pressText!: Phaser.GameObjects.Text;

  constructor() { super('Title'); }

  create() {
    // C64-style background
    this.cameras.main.setBackgroundColor(C64.BLUE);

    const cx = SCREEN_W / 2;

    // Title
    this.add.text(cx, 30, 'SPACE TAXI', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#' + C64.YELLOW.toString(16).padStart(6, '0'),
      stroke: '#' + C64.BROWN.toString(16).padStart(6, '0'),
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Sub-title
    this.add.text(cx, 60, 'A faithful C64 recreation', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#' + C64.LIGHT_GREY.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Draw a little taxi
    this.drawTitleTaxi(cx - 12, 90);

    // Instructions
    const lines = [
      'ARROW KEYS / SPACE  - Thrust & steer',
      '',
      'Land on a pad to pick up passengers.',
      'Deliver them to their requested pad.',
      '',
      'Land gently or your taxi will crash!',
      'Watch your FUEL!',
    ];
    lines.forEach((line, i) => {
      this.add.text(cx, 150 + i * 14, line, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#' + C64.WHITE.toString(16).padStart(6, '0'),
      }).setOrigin(0.5);
    });

    // High scores placeholder
    this.add.text(cx, 240, 'HIGH SCORE: 00000', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#' + C64.CYAN.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Blinking press-start
    this.pressText = this.add.text(cx, 258, 'PRESS SPACE TO START', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#' + C64.WHITE.toString(16).padStart(6, '0'),
    }).setOrigin(0.5);

    // Input
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('Game', { level: 1, score: 0, lives: 3, fuel: 999 });
    });
    this.input.keyboard!.once('keydown-ENTER', () => {
      this.scene.start('Game', { level: 1, score: 0, lives: 3, fuel: 999 });
    });
  }

  private drawTitleTaxi(x: number, y: number) {
    const g = this.add.graphics();
    const T = 8;
    // Body
    g.fillStyle(C64.YELLOW);
    g.fillRect(x + T, y, T, T);
    g.fillRect(x, y + T, T * 3, T);
    // Window
    g.fillStyle(C64.LIGHT_BLUE);
    g.fillRect(x + T + 1, y + 1, T - 2, T - 2);
    // Wheels
    g.fillStyle(C64.DARK_GREY);
    g.fillRect(x + 2, y + T * 2 - 2, 4, 2);
    g.fillRect(x + T * 3 - 6, y + T * 2 - 2, 4, 2);
    // Antenna
    g.fillStyle(C64.WHITE);
    g.fillRect(x + T + 3, y - 3, 2, 3);
  }

  update(_time: number, delta: number) {
    this.blinkTimer += delta;
    if (this.blinkTimer > 500) {
      this.blinkTimer = 0;
      this.pressText.setVisible(!this.pressText.visible);
    }
  }
}
