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
    this.createGroups();
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

  createGroups() {
    // create a chest group
    this.chestGroup = this.physics.add.group();


  }

  createGameManager() {

    this.events.on('spawnPlayer', (location) => {
      this.createPlayer(location);
      this.addCollisions();
    })

    this.events.on('chestSpawned', (chest) => {
      this.spawnChest(chest);
    })


    const scene = this;
    const mapData = this.map.map.objects;
    this.gameManager = new GameManager(scene, mapData);
    this.gameManager.setup();
  }


  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }


  collectChest(player, chest) {

    this.goldPickupAudio.play();
    this.score += chest.coins;

    this.events.emit('updateScore', this.score);
    chest.makeInactive();

    this.events.emit('pickUpChest', chest.id);
    // this.time.delayedCall(1000, this.spawnChest, [], this);
  }


  createMap() {

    this.map = new Map(this, 'tilesetJSON', 'tilesetPNG', 'bottom', 'blocked');
    
  }

  spawnChest(chestObject) {
    // const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];
    const location = [chestObject.x * 2, chestObject.y * 2]

    let chest = this.chestGroup.getFirstDead();

    if (!chest) {
      // TODO: convert to object params
      const chest = new Chest(this, location[0], location[1], 'items', 0, chestObject.gold, chestObject.id);
      // add chest to chests group
      this.chestGroup.add(chest);
    } else {
      chest.setPosition(location[0], location[1]);
      chest.makeActive();
    }
  }


}
