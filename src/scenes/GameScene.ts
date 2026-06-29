import Phaser from 'phaser';
import { C64, TILE, SCREEN_W, SCREEN_H, FUEL_MAX, SCORE_PICKUP, SCORE_DELIVERY_BASE } from '../constants.ts';
import { LEVELS } from '../levels/LevelData.ts';
import { Taxi } from '../objects/Taxi.ts';
import { Passenger } from '../objects/Passenger.ts';
import type { LevelDefinition, PadDefinition, PassengerState, GamePhase } from '../types.ts';

interface GameData {
  level: number;
  score: number;
  lives: number;
  fuel: number;
}

export class GameScene extends Phaser.Scene {
  private taxi!: Taxi;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private thrustKey!: Phaser.Input.Keyboard.Key;

  private level!: LevelDefinition;
  private walls: Phaser.Geom.Rectangle[] = [];
  private pads: Array<{ def: PadDefinition; rect: Phaser.Geom.Rectangle }> = [];
  private passengers: Passenger[] = [];

  private score = 0;
  private lives = 3;
  private phase: GamePhase = 'playing';

  // UI elements (managed by HudScene overlay)
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private fuelText!: Phaser.GameObjects.Text;
  private fuelBar!: Phaser.GameObjects.Graphics;
  private messageText!: Phaser.GameObjects.Text;

  private passengerAboard: Passenger | null = null;
  private landedPadId: string | null = null;
  private deadTimer = 0;
  private levelCompleteTimer = 0;
  private totalPassengers = 0;
  private deliveredCount = 0;

  private worldGfx!: Phaser.GameObjects.Graphics;
  private explosionGfx!: Phaser.GameObjects.Graphics;
  private explosionTimer = 0;

  // Callout bubble
  private calloutBubble!: Phaser.GameObjects.Graphics;
  private calloutText!: Phaser.GameObjects.Text;
  private calloutTimer = 0;

  constructor() { super('Game'); }

  init(data: GameData) {
    this.score = data.score ?? 0;
    this.lives = data.lives ?? 3;
    this.phase = 'playing';
    this.passengerAboard = null;
    this.landedPadId = null;
    this.deliveredCount = 0;
    this.deadTimer = 0;
    this.levelCompleteTimer = 0;
    this.explosionTimer = 0;
    this.calloutTimer = 0;
    this.walls = [];
    this.pads = [];
    this.passengers = [];

    const levelIdx = Math.min((data.level ?? 1) - 1, LEVELS.length - 1);
    this.level = LEVELS[levelIdx];
    this.totalPassengers = this.level.passengers.length;
  }

  create() {
    this.cameras.main.setBackgroundColor(this.level.bgColor);

    // World graphics layer
    this.worldGfx = this.add.graphics().setDepth(0);
    this.explosionGfx = this.add.graphics().setDepth(20);

    this.buildLevel();

    // Taxi
    this.taxi = new Taxi(
      this,
      this.level.taxiStart.x,
      this.level.taxiStart.y,
      FUEL_MAX,
    );
    this.taxi.sprite.setDepth(5);
    // Start landed on the H pad
    this.taxi.isLanded = true;
    this.landedPadId = 'H';

    // Spawn passengers
    this.spawnPassengers();

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.thrustKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // HUD
    this.createHud();

    // Callout
    this.calloutBubble = this.add.graphics().setDepth(15);
    this.calloutText = this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#000000',
    }).setDepth(16);

    this.messageText = this.add.text(SCREEN_W / 2, SCREEN_H / 2 - 10, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#' + C64.WHITE.toString(16).padStart(6, '0'),
      stroke: '#000000',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(30);
  }

  private buildLevel() {
    const g = this.worldGfx;
    g.clear();

    this.walls = [];
    this.pads = [];

    // Draw walls
    for (const w of this.level.walls) {
      g.fillStyle(w.color);
      g.fillRect(w.x, w.y, w.width, w.height);
      this.walls.push(new Phaser.Geom.Rectangle(w.x, w.y, w.width, w.height));
    }

    // Draw pads
    for (const pad of this.level.pads) {
      const px = pad.x * TILE;
      const py = pad.y * TILE;
      const pw = pad.width * TILE;
      const ph = 4; // pad surface height

      // Pad surface color
      const padColor = pad.id === 'H' ? C64.RED : C64.LIGHT_GREY;
      g.fillStyle(padColor);
      g.fillRect(px, py, pw, ph);

      // Pad number/letter
      const label = this.add.text(px + pw / 2, py - 9, pad.id, {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#' + padColor.toString(16).padStart(6, '0'),
      }).setOrigin(0.5).setDepth(1);

      // Collision rect (surface)
      this.pads.push({
        def: pad,
        rect: new Phaser.Geom.Rectangle(px, py, pw, ph + 2),
      });

      void label; // label rendered, no ref needed
    }
  }

  private spawnPassengers() {
    let id = 0;
    for (const spawn of this.level.passengers) {
      const srcPad = this.level.pads.find(p => p.id === spawn.padId);
      if (!srcPad) continue;

      const px = srcPad.x * TILE + srcPad.width * TILE * 0.4;
      const py = srcPad.y * TILE - 2;

      const state: PassengerState = {
        id: id++,
        sourcePad: spawn.padId,
        destPad: spawn.destPadId,
        state: 'waiting',
        x: px,
        y: py,
        walkDir: 1,
      };

      this.passengers.push(new Passenger(this, state));
    }
  }

  private createHud() {
    const hudY = SCREEN_H - 14;
    const style = { fontFamily: 'monospace', fontSize: '8px', color: '#ffffff' };

    this.scoreText = this.add.text(4, hudY, 'SCORE: 0', style).setDepth(25);
    this.livesText = this.add.text(SCREEN_W / 2, hudY, 'LIVES: 3', style).setOrigin(0.5, 0).setDepth(25);
    this.fuelText = this.add.text(SCREEN_W - 4, hudY, 'FUEL: 999', style).setOrigin(1, 0).setDepth(25);
    this.add.text(SCREEN_W / 2, 4, `LEVEL ${this.level.id}: ${this.level.name}`, {
      ...style, color: '#' + C64.YELLOW.toString(16).padStart(6, '0'),
    }).setOrigin(0.5, 0).setDepth(25);

    // Fuel bar background
    this.fuelBar = this.add.graphics().setDepth(24);

    // HUD background strip
    const hudBg = this.add.graphics().setDepth(23);
    hudBg.fillStyle(C64.BLACK, 0.7);
    hudBg.fillRect(0, SCREEN_H - 16, SCREEN_W, 16);
  }

  private updateHud() {
    this.scoreText.setText(`SCORE: ${this.score}`);
    this.livesText.setText(`LIVES: ${this.lives}`);

    const fuel = Math.floor(this.taxi.fuel);
    this.fuelText.setText(`FUEL: ${fuel}`);

    // Fuel bar
    const g = this.fuelBar;
    g.clear();
    const barW = 60;
    const barX = SCREEN_W - barW - 60;
    const barY = SCREEN_H - 12;
    const fillW = Math.floor((fuel / FUEL_MAX) * barW);
    const barColor = fuel > 300 ? C64.GREEN : fuel > 100 ? C64.YELLOW : C64.RED;
    g.fillStyle(C64.DARK_GREY);
    g.fillRect(barX, barY, barW, 6);
    g.fillStyle(barColor);
    g.fillRect(barX, barY, fillW, 6);
  }

  private showCallout(text: string, x: number, y: number) {
    const padding = 4;
    const w = text.length * 5 + padding * 2;
    const h = 12;
    const bx = x - w / 2;
    const by = y - 22;

    this.calloutBubble.clear();
    this.calloutBubble.fillStyle(C64.WHITE);
    this.calloutBubble.fillRect(bx, by, w, h);
    this.calloutBubble.fillStyle(C64.BLACK);
    this.calloutBubble.fillRect(bx + 1, by + 1, w - 2, h - 2);

    this.calloutText.setText(text).setPosition(bx + padding, by + 2).setVisible(true);
    this.calloutTimer = 3000;
  }

  private hideCallout() {
    this.calloutBubble.clear();
    this.calloutText.setVisible(false);
    this.calloutTimer = 0;
  }

  private showMessage(msg: string, color: number = C64.WHITE) {
    this.messageText.setText(msg);
    this.messageText.setColor('#' + color.toString(16).padStart(6, '0'));
    this.messageText.setVisible(true);
  }

  // ── Physics & Collision ───────────────────────────────────────────────────

  private resolveWallCollisions(): boolean {
    const tb = this.taxi.getBounds();

    for (const wall of this.walls) {
      if (Phaser.Geom.Rectangle.Overlaps(tb, wall)) {
        return true; // crash
      }
    }

    // Screen boundary
    if (this.taxi.x < 0 || this.taxi.x + this.taxi.w > SCREEN_W ||
        this.taxi.y < 0 || this.taxi.y + this.taxi.h > SCREEN_H) {
      return true;
    }

    return false;
  }

  private checkPadLanding(): string | null {
    if (this.taxi.vy < 0) return null; // ascending — can't land

    const lr = this.taxi.getLandingRect();

    for (const pad of this.pads) {
      if (Phaser.Geom.Rectangle.Overlaps(lr, pad.rect)) {
        return pad.def.id;
      }
    }

    return null;
  }

  private crashTaxi() {
    this.phase = 'dead';
    this.lives--;
    this.taxi.sprite.setVisible(false);
    this.spawnExplosion(this.taxi.x + this.taxi.w / 2, this.taxi.y + this.taxi.h / 2);

    if (this.lives <= 0) {
      this.showMessage('GAME OVER', C64.RED);
    } else {
      this.showMessage('CRASH!', C64.RED);
    }
    this.deadTimer = this.lives <= 0 ? 3000 : 1500;
  }

  private spawnExplosion(cx: number, cy: number) {
    const g = this.explosionGfx;
    g.clear();
    const colors = [C64.RED, C64.ORANGE, C64.YELLOW, C64.WHITE];
    for (let i = 0; i < 20; i++) {
      const r = Phaser.Math.Between(2, 16);
      const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const ex = cx + Math.cos(angle) * r;
      const ey = cy + Math.sin(angle) * r;
      g.fillStyle(colors[Phaser.Math.Between(0, colors.length - 1)]);
      g.fillRect(ex - 2, ey - 2, 4, 4);
    }
    this.explosionTimer = 600;
  }

  // ── Passenger logic ───────────────────────────────────────────────────────

  private handleLanding(padId: string) {
    this.taxi.isLanded = true;
    this.landedPadId = padId;

    // Drop off passenger if aboard and this is their destination
    if (this.passengerAboard && this.passengerAboard.state.destPad === padId) {
      this.startAlighting();
      return;
    }

    // Pick up a waiting passenger on this pad
    if (!this.passengerAboard) {
      const p = this.passengers.find(
        ps => ps.state.sourcePad === padId && ps.state.state === 'waiting',
      );
      if (p) {
        this.startBoarding(p);
      }
    }
  }

  private startBoarding(p: Passenger) {
    p.state.state = 'boarding';
    this.showCallout(p.calloutText, this.taxi.x + this.taxi.w / 2, this.taxi.y);
    this.calloutTimer = 2500;
  }

  private startAlighting() {
    if (!this.passengerAboard || !this.landedPadId) return;
    this.passengerAboard.state.state = 'alighting';
    const pad = this.pads.find(p => p.def.id === this.landedPadId);
    if (pad) {
      this.passengerAboard.state.x = this.taxi.x + this.taxi.w;
      this.passengerAboard.state.y = pad.rect.y - 2;
    }
  }

  private finishBoarding(p: Passenger) {
    p.state.state = 'aboard';
    this.passengerAboard = p;
    this.score += SCORE_PICKUP;
    this.hideCallout();
  }

  private finishAlighting() {
    this.score += SCORE_DELIVERY_BASE + Math.floor(this.taxi.fuel / 10);
    this.passengerAboard = null;
    this.deliveredCount++;

    if (this.deliveredCount >= this.totalPassengers) {
      this.phase = 'levelcomplete';
      this.showMessage('LEVEL COMPLETE!', C64.LIGHT_GREEN);
      this.levelCompleteTimer = 2500;
    }
  }

  // ── Update loop ───────────────────────────────────────────────────────────

  update(_time: number, delta: number) {
    const dt = delta / 1000;

    switch (this.phase) {
      case 'dead':    this.updateDead(dt);    break;
      case 'levelcomplete': this.updateLevelComplete(dt); break;
      case 'gameover': break; // frozen
      case 'playing': this.updatePlaying(dt); break;
    }

    this.updateHud();
  }

  private updatePlaying(dt: number) {
    // Taxi physics
    this.taxi.update(dt, this.cursors, this.thrustKey);

    // Lift off only on a fresh UP/SPACE press — not a held key from braking
    if (this.taxi.isLanded) {
      const K = Phaser.Input.Keyboard;
      const liftOff = K.JustDown(this.cursors.up) || K.JustDown(this.thrustKey);
      if (liftOff) {
        this.taxi.isLanded = false;
        this.taxi.vy = -15;
        this.landedPadId = null;
        this.hideCallout();
      }
    }

    if (!this.taxi.isLanded) {
      // Landing check runs BEFORE wall collision: the pad surface and its
      // supporting ledge share the same y, so a top-down approach triggers
      // both. Landing must win so the taxi snaps cleanly instead of crashing.
      const padId = this.checkPadLanding();
      if (padId !== null) {
        if (this.taxi.checkSafeLanding()) {
          const pad = this.pads.find(p => p.def.id === padId)!;
          this.taxi.y = pad.rect.y - this.taxi.h;
          this.handleLanding(padId);
        } else {
          this.crashTaxi();
          return;
        }
      }

      // Wall collision only checked when not on a pad
      if (!this.taxi.isLanded && this.resolveWallCollisions()) {
        this.crashTaxi();
        return;
      }
    }

    // Fuel empty → crash
    if (this.taxi.fuel <= 0 && !this.taxi.isLanded) {
      // Grace: just cut thrust but gravity still applies
    }

    // Passengers: boarding animation
    for (const p of this.passengers) {
      if (p.state.state === 'boarding' && this.taxi.isLanded) {
        const done = p.updateBoarding(this.taxi.x, this.taxi.y, dt);
        if (done) this.finishBoarding(p);
      }

      if (p.state.state === 'alighting') {
        const pad = this.pads.find(pad => pad.def.id === this.landedPadId);
        if (pad) {
          const done = p.updateAlighting(pad.rect.x, pad.rect.y - 2, dt);
          if (done) {
            this.finishAlighting();
            // Remove from array after full alighting
            this.passengers = this.passengers.filter(ps => ps !== p);
          }
        }
      }
    }

    // Callout timer
    if (this.calloutTimer > 0) {
      this.calloutTimer -= 1000 * dt;
      if (this.calloutTimer <= 0) {
        this.hideCallout();
      }
    }

    // Explosion fade
    if (this.explosionTimer > 0) {
      this.explosionTimer -= 1000 * dt;
      if (this.explosionTimer <= 0) {
        this.explosionGfx.clear();
      }
    }
  }

  private updateDead(dt: number) {
    this.deadTimer -= 1000 * dt;
    if (this.deadTimer <= 0) {
      this.explosionGfx.clear();
      if (this.lives <= 0) {
        this.scene.start('Title');
      } else {
        // Respawn on same level
        this.scene.start('Game', {
          level: this.level.id,
          score: this.score,
          lives: this.lives,
          fuel: FUEL_MAX,
        });
      }
    }
  }

  private updateLevelComplete(dt: number) {
    this.levelCompleteTimer -= 1000 * dt;
    if (this.levelCompleteTimer <= 0) {
      const nextLevel = this.level.id + 1;
      if (nextLevel > LEVELS.length) {
        this.showMessage('YOU WIN!', C64.YELLOW);
        this.time.delayedCall(3000, () => {
          this.scene.start('Title');
        });
      } else {
        this.scene.start('Game', {
          level: nextLevel,
          score: this.score,
          lives: this.lives,
          fuel: FUEL_MAX,
        });
      }
    }
  }
}
