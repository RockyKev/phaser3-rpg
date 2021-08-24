import {Player} from "../classes/Player.js";
import {Chest} from "../classes/Chest.js";
import {Map} from "../classes/Map.js";
import { GameManager } from "../game_manager/GameManager.js";

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
    this.createInput();

    this.createGameManager();

  }

  update() {
    if (this.player) this.player.update(this.cursors);
  }


  addCollisions() {
    // check for collisions between player and wall objects
    // console.log("player", this.player)
    // console.log("map", this.map)
    this.physics.add.collider(this.player, this.map.blockedLayer);

    // check for overlaps between player and chest game objects
    this.physics.add.overlap(this.player, this.chestGroup, this.collectChest, null, this);
  }

  createAudio() {
    this.goldPickupAudio = this.sound.add('goldSound', { loop: false, volume: 0.2 });
  }

  createPlayer(location) {

    const playerX = location[0] * 2;
    const playerY = location[1] * 2;

    this.player = new Player(this, playerX, playerY, 'characters', 0);
  }

  createChests() {
    // create a chest group
    this.chestGroup = this.physics.add.group();
    // create chest positions array
    this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];
    // specify the max number of chest we can have
    this.maxNumberOfChests = 3;
    // spawn a chest
    for (let i = 0; i < this.maxNumberOfChests; i += 1) {
      this.spawnChest();
    }
  }

  createGameManager() {

    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    })

    this.gameManager = new GameManager(this, this.map.map.objects);
    this.gameManager.setup();
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
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

   
  }

  spawnChest() {
    const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

    let chest = this.chestGroup.getFirstDead();

    if (!chest) {
      const chest = new Chest(this, location[0], location[1], 'items', 0);
      // add chest to chests group
      this.chestGroup.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }


}
