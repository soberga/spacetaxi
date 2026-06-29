import Phaser from 'phaser';

// Minimal boot scene — just transitions straight to Title
export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scene') === 'game') {
      this.scene.start('Game', { level: 1, score: 0, lives: 3, fuel: 999 });
    } else {
      this.scene.start('Title');
    }
  }
}
