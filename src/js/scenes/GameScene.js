import {Player} from "../classes/Player.js";
import {Chest} from "../classes/Chest.js";
import {Map} from "../classes/Map.js";


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

    const playerX = 32 * 7;
    const playerY = 32 * 7;
    
    this.player = new Player(this, playerX, playerY, 'characters', 0);
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
    this.physics.add.collider(this.player, this.map.blockedLayer);

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

    this.map = new Map(this, 'tilesetJSON', 'tilesetPNG', 'bottom', 'blocked');

    // 32 x 32. 
    // const mapScale = 2;

    // // create the tile map add the tileset image to our map
    // this.map = this.make.tilemap({ key: 'tilesetJSON' });

    // // The first param is the json->tilesets.name 
    // this.tiles = this.map.addTilesetImage('rogue-bkgd', 'tilesetPNG', 32, 32, 1, 2);

    // // create our background (layer name within JSON)
    // this.bottomLayer = this.map.createLayer('bottom', this.tiles, 0, 0);
    // this.bottomLayer.setScale(mapScale);
    // this.blockedLayer = this.map.createLayer('blocked', this.tiles, 0, 0);
    // this.blockedLayer.setScale(mapScale);

    // // This method, setCollisionByExclusion, takes in an array to determine which tiles should be excluded from being checked. Using an array value of [-1] means that all of the tiles in the layer will be checked for collisions. 
    // this.blockedLayer.setCollisionByExclusion([-1]);

    // // make the world the size of our map element. Then force the camera edge.
    // this.physics.world.bounds.width = this.map.widthInPixels * mapScale;
    // this.physics.world.bounds.height = this.map.heightInPixels * mapScale;
    // this.cameras.main.setBounds(0, 0, this.map.widthInPixels * mapScale, this.map.heightInPixels * mapScale)
  }

}
