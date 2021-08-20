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
    this.load.image('background', 'resources/completed/level/background-extruded.png');
  }

  loadSpriteSheets() {
    this.load.spritesheet('items', 'src/images/items.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('characters', 'src/images/characters.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monsters', 'src/images/monsters.png', { frameWidth: 32, frameHeight: 32 });
  }

  loadAudio() {
    this.load.audio('goldSound', ['src/audio/Pickup.wav']);
    this.load.audio('enemyDeath', ['src/audio/EnemyDeath.wav']);
    this.load.audio('playerAttack', ['src/audio/PlayerAttack.wav']);
    this.load.audio('playerDamage', ['src/audio/PlayerDamage.wav']);
    this.load.audio('playerDeath', ['src/audio/PlayerDeath.wav']);
  }

  loadTileMap() {
    // map made with Tiled in JSON format
    this.load.tilemapTiledJSON('map', 'resources/completed/level/large_level.json');
  }

  create() {
    this.scene.start('Title');
  }
}
