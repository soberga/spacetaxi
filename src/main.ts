import Phaser from 'phaser';
import { SCREEN_W, SCREEN_H } from './constants.ts';
import { BootScene } from './scenes/BootScene.ts';
import { TitleScene } from './scenes/TitleScene.ts';
import { GameScene } from './scenes/GameScene.ts';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: SCREEN_W,
  height: SCREEN_H,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: '#000000',
  scene: [BootScene, TitleScene, GameScene],
  physics: { default: 'arcade' },
  render: {
    pixelArt: true,
    antialias: false,
  },
  input: {
    keyboard: { target: window },
  },
  parent: document.body,
};

new Phaser.Game(config);
