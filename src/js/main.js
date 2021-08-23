import {BootScene} from "./scenes/BootScene.js";
import {TitleScene} from "./scenes/TitleScene.js";
import {GameScene} from "./scenes/GameScene.js";
import {UIScene} from "./scenes/UIScene.js";


var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    UIScene,
  ],
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
  roundPixels: true
};

var game = new Phaser.Game(config);
