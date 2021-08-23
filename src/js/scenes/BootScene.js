export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // load images
    this.loadImages();
    // load spritesheets
    this.loadSpriteSheets();
    // load audio
    this.loadAudio();
    // load tilemap
    this.loadTileMap();
  }

  loadImages() {
    this.load.image('button1', 'src/images/ui/blue_button01.png');
    this.load.image('button2', 'src/images/ui/blue_button02.png');

    // load the map tileset image
    this.load.image('tilesetPNG', 'src/levels/background-extruded.png');
    // this.load.image('tilesetPng', 'src/levels/background.png');
    // this.load.image('background', 'src/levels/background-extruded.png');

  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'src/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'src/images/characters.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio() {
    this.load.audio('goldSound', ['src/audio/Pickup.wav']);
  }

  loadTileMap() {
    this.load.tilemapTiledJSON('tilesetJSON', 'src/levels/large_level2.json');
    // this.load.tilemapTiledJSON('map', 'src/levels/large_level.json');

  }

  create() {
   this.scene.start('Title');
    // this.scene.start('Game');
  }
}
