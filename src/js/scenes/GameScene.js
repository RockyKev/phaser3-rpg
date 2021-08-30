import { PlayerContainer } from '../classes/player/PlayerContainer.js';
import { Chest } from '../classes/Chest.js';
import { Map } from '../classes/Map.js';
import { GameManager } from '../game_manager/GameManager.js';
import { Monster } from '../classes/Monster.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.scene.launch('Ui');
        // this.score = 0;
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

    createGameManager() {
        // TODO: When does an event appear in GameScenes VS GameManager?
        // maybe when the scene needs to be cleaned.
        this.events.on('spawnPlayer', (playerObject) => {
            this.createPlayer(playerObject);
            this.addCollisions();
        });

        this.events.on('chestSpawned', (chest) => {
            this.spawnChest(chest);
        });

        this.events.on('monsterSpawned', (monster) => {
            this.spawnMonster(monster);
        });

        this.events.on('chestRemoved', (chestId) => {
            // TODO: clean this up - FILTER!
            this.chestGroup.getChildren().forEach((chest) => {
                if (chest.id === chestId) {
                    chest.makeInactive();
                }
            });
        });

        // make monster inactive on event monsterRemoved
        this.events.on('monsterRemoved', (monsterId) => {
            // TODO: clean this up - FILTER!

            this.monsterGroup.getChildren().forEach((monster) => {
                if (monster.id === monsterId) {
                    console.log(
                        'MONSTER DESTROYED: Comparison->: ' +
                            monster.spawnerId +
                            '->' +
                            monsterId
                    );
                    this.monsterDeathAudio.play();
                    monster.makeInactive();
                }
            });
        });

        this.events.on('monsterUpdateHealth', (monsterId, health) => {
            // TODO: clean this up - FILTER!
            this.monsterGroup.getChildren().forEach((monster) => {
                if (monster.id === monsterId) {
                    console.log('MONSTER HEALTH UPDATE');
                    monster.updateHealth(health);
                }
            });
        });

        this.events.on('playerUpdateHealth', (playerId, health) => {
            if (health < this.playerHealth) {
                this.playerDeathAudio.play();
            }
            this.player.updateHealth(health);
        });

        this.events.on('playerRespawn', (playerObject) => {
            this.playerDeathAudio.play();
            this.player.respawn(playerObject);
        });

        // TODO: JESUS WHAT A MESS
        this.events.on('monsterMovement', (monsters) => {
            // console.log("starting monsters", monsters)
            this.monsterGroup.getChildren().forEach((monster) => {
                Object.keys(monsters).forEach((monsterId) => {
                    // console.log("second foreach", monsterId);

                    if (monster.id === monsterId) {
                        this.physics.moveToObject(
                            monster,
                            monsters[monsterId],
                            40
                        );
                    }
                });
            });
        });

        const scene = this;
        const mapData = this.map.map.objects;
        this.gameManager = new GameManager(scene, mapData);
        this.gameManager.setup();
    }

    addCollisions() {
        // add a collider between the monster and the blocked layer. That way the monsters won’t be moving over the blocked tiles
        // check for collisions between player and wall objects

        // check for collisions beteen player and tiled block layer
        // DOES THIS WORK?

        this.physics.add.collider(this.player, this.map.blockedLayer);

        // check for overlaps between player and chest game objects
        this.physics.add.overlap(
            this.player,
            this.chestGroup,
            this.collectChest,
            null,
            this
        );

        // check for collisions between monster group and tiled block layer
        this.physics.add.collider(this.monsterGroup, this.map.blockedLayer);

        // check for collision between player's weapon and monster group
        this.physics.add.overlap(
            this.player.weapon,
            this.monsterGroup,
            this.enemyOverlap,
            null,
            this
        );
    }

    enemyOverlap(weapon, enemy) {
        // callbacks have two params. The initial collider and what it's hitting (sword -> enemy)
        // weapon doesn't need to be triggered.

        // emits will pass this event to the GameManager

        if (this.player.playerAttacking && !this.player.swordHit) {
            this.player.swordHit = true;

            // One hit kill
            // enemy.makeInactive();
            // this.events.emit('destroyEnemy', enemy.id);

            // with health points
            console.log('weapon hitting', weapon)
            console.log('sword hitting this enemy->', enemy);
            this.events.emit('monsterAttacked', enemy.id, this.player.id);
        }
    }

    createAudio() {
        const defaultOpts = {
            loop: false,
            volume: 0.2,
        };

        this.goldPickupAudio = this.sound.add('goldSound', defaultOpts);
        this.playerAttackAudio = this.sound.add('playerAttack', {
            loop: false,
            volume: 0.01,
        });
        this.playerDamageAudio = this.sound.add('playerDamage', defaultOpts);
        this.playerDeathAudio = this.sound.add('playerDeath', defaultOpts);
        this.monsterDeathAudio = this.sound.add('enemyDeath', defaultOpts);
    }

    createPlayer(playerObject) {

        this.player = new PlayerContainer({
            scene: this,
            x: playerObject.x * 2,
            y: playerObject.y * 2,
            key: 'characters',
            frame: 0,
            health: playerObject.health,
            maxHealth: playerObject.maxHealth,
            id: playerObject.id,
            attackAudio: this.playerAttackAudio,
        });
        // console.log(this.player);
    }

    createGroups() {
        this.chestGroup = this.physics.add.group();
        this.monsterGroup = this.physics.add.group();

        // this feature causes update() to run automatically
        this.monsterGroup.runChildUpdate = true;
    }

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectChest(player, chest) {
        this.goldPickupAudio.play();

        this.events.emit('pickUpChest', chest.id, player.id);
    }

    createMap() {
        this.map = new Map({
            scene: this,
            tileMapkey: 'tilesetJSON',
            tileSetName: 'tilesetPNG',
            bottomLayerName: 'bottom',
            blockedLayerName: 'blocked',
        });
    }

    spawnChest(chestObject) {
        // const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];
        const location = [chestObject.x * 2, chestObject.y * 2];

        let chest = this.chestGroup.getFirstDead();

        if (!chest) {
            chest = new Chest({
                scene: this,
                x: location[0],
                y: location[1],
                key: 'items',
                frame: 0,
                coins: chestObject.gold,
                id: chestObject.id,
            });

            this.chestGroup.add(chest);
        } else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
    }

    spawnMonster(monsterObject) {
        let monster = this.monsterGroup.getFirstDead();
        // console.log({monster})
        // console.log({monsterObject});

        if (!monster) {
            monster = new Monster({
                scene: this,
                x: monsterObject.x,
                y: monsterObject.y,
                key: 'monsters',
                frame: monsterObject.frame,
                id: monsterObject.id,
                health: monsterObject.health,
                maxHealth: monsterObject.maxHealth,
            });

            this.monsterGroup.add(monster);
        } else {
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxHealth = monsterObject.maxHealth;
            monster.setTexture('monsters', monsterObject.frame);
            monster.setPosition(monsterObject.x, monsterObject.y);
            monster.makeActive();
        }
    }
}
