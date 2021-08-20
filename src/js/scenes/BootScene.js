class BootScene extends Phaser.Scene {
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
    this.load.image('tilesetBackground', 'src/levels/background.png');
  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'src/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'src/images/characters.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio() {
    this.load.audio('goldSound', ['src/audio/Pickup.wav']);
  }

  loadTileMap() {
    this.load.tilemapTiledJSON('tilesetJson', 'src/levels/large_level2.json');
  }

  create() {
    this.scene.start('Title');
  }
}
