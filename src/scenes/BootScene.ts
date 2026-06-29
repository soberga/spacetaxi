import Phaser from 'phaser';

// Minimal boot scene — just transitions straight to Title
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'game') {
      const level = parseInt(params.get('level') ?? '1', 10) || 1;
      this.scene.start('Game', { level, score: 0, lives: 3, fuel: 999 });
    } else {
      this.scene.start('Title');
    }
  }
}
