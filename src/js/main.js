import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';

var config = {
    type: Phaser.AUTO,
    width: 1600 / 1.35,
    height: 900 / 1.35,
    // width: 1200,
    // height: 700,
    scene: [BootScene, TitleScene, GameScene, UIScene],
    scale: {
        mode: Phaser.Scale.FIT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: 0,
            },
        },
    },
    pixelArt: true,
    roundPixels: true,
};

var game = new Phaser.Game(config);
