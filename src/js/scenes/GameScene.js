import {Player} from "../classes/Player.js";
import {Chest} from "../classes/Chest.js";


export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  init() {
    this.scene.launch('Ui');
    this.score = 0;
  }

  create() {
    this.createMap();
    this.createAudio();
    this.createChests();
    // this.createWalls();
    this.createPlayer();
    this.addCollisions();
    this.createInput();

  }

  update() {
    this.player.update(this.cursors);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer() {
    this.player = new Player(this, 32, 32, 'characters', 0);
  }

  createChests() {
    // create a chest group
    this.chests = this.physics.add.group();
    // create chest positions array
    this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
    // specify the max number of chest we can have
    this.maxNumberOfChests = 3;
    // spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i += 1) {
      this.spawnChest();
    }
  }

  spawnChest() {
    const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

    let chest = this.chests.getFirstDead();

    if (!chest) {
      const chest = new Chest(this, location[0], location[1], 'items', 0);
      // add chest to chests group
      this.chests.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  addCollisions() {
    // check for collisions between player and wall objects
    this.physics.add.collider(this.player, this.wall);
    // check for overlaps between player and chest game objects
    this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
  }

  collectChest(player, chest) {
    // play gold pickup sound
    this.goldPickupAudio.play();
    // update our score
    this.score += chest.coins;
    // update score in the ui
    this.events.emit('updateScore', this.score);
    // make chest game object inactive
    chest.makeInactive();
    // spawn a new chest
    this.time.delayedCall(1000, this.spawnChest, [], this);
  }


  createMap() {
    // 32 x 32. 
    const mapScale = 2;

    // create the tile map
    this.map = this.make.tilemap({ key: 'tilesetJSON' });

    // add the tileset image to our map
    // The first param is the json->tilesets.name 
    this.tiles = this.map.addTilesetImage('rogue-bkgd', 'tilesetPNG', 32, 32, 1, 2);

    // create our background (layer name within JSON)
    this.bottomLayer = this.map.createLayer('bottom', this.tiles, 0, 0);
    this.bottomLayer.setScale(mapScale);

    this.blockLayer = this.map.createLayer('blocked', this.tiles, 0, 0);
    this.blockLayer.setScale(mapScale);

    // make the world the size of our map element
    this.physics.world.bounds.width = this.map.widthInPixels * mapScale;
    this.physics.world.bounds.height = this.map.heightInPixels * mapScale;

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels * mapScale, this.map.heightInPixels * mapScale)

  }

}
