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
            this.chestGroup.getChildren().forEach( (chest) => {
                if (chest.id === chestId) {
                    chest.makeInactive();
                }
            })

        })

        // make monster inactive on event monsterRemoved
        this.events.on('monsterRemoved', (monsterId) => {
            // TODO: clean this up - FILTER!
            this.monsterGroup.getChildren().forEach( (monster) => {
                if (monster.spawnerId === monsterId) {
                    console.log("MONSTER DESTROYED: Comparison->: " + monster.spawnerId + "->" + monsterId)
                    monster.makeInactive();
                }
            })

        })

        this.events.on('monsterUpdateHealth', (monsterId, health) => {
            // TODO: clean this up - FILTER!
            this.monsterGroup.getChildren().forEach( (monster) => {
                if (monster.spawnerId === monsterId) {
                    console.log("MONSTER HEALTH UPDATE");
                    monster.updateHealth(health);
                }
            })

        })

        
        this.events.on('playerUpdateHealth', (playerId, health) => {
            this.player.updateHealth(health);
        })


        this.events.on('playerRespawn', (playerObject) => {
            this.player.respawn(playerObject);
        })


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

        // emits will pass this event to the GameManager

        if (this.player.playerAttacking && !this.player.swordHit) {
            this.player.swordHit = true; 

            // One hit kill
            // enemy.makeInactive();
            // this.events.emit('destroyEnemy', enemy.id);

            // with health points
            // this.player.swordHit = true; 
            console.log("sword hitting this enemy->", enemy);
            // this.events.emit('monsterAttacked', enemy.spawnerId, this.player.id);
            this.events.emit('monsterAttacked', enemy.spawnerId, this.player.id);

        }

    }

    createAudio() {
        this.goldPickupAudio = this.sound.add('goldSound', {
            loop: false,
            volume: 0.2,
        });
    }

    createPlayer(playerObject) {

        this.player = new PlayerContainer(
            this, 
            playerObject.x * 2, 
            playerObject.y * 2,
            'characters', 
            0, 
            playerObject.health, 
            playerObject.maxHealth, 
            playerObject.id
        )

        // const playerX = location[0] * 2;
        // const playerY = location[1] * 2;

        // this.player = new PlayerContainer(
        //     this,
        //     playerX,
        //     playerY,
        //     'characters',
        //     0
        // );
        console.log(this.player);
    }

    createGroups() {
        // create a chest group
        this.chestGroup = this.physics.add.group();

        this.monsterGroup = this.physics.add.group();
    }

  
    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    collectChest(player, chest) {
        this.goldPickupAudio.play();
        // this.score += chest.coins;

        // this.events.emit('updateScore', this.score);
        // chest.makeInactive();

        this.events.emit('pickUpChest', chest.id, player.id);
        // this.time.delayedCall(1000, this.spawnChest, [], this);
    }

    createMap() {
        this.map = new Map(
            this,
            'tilesetJSON',
            'tilesetPNG',
            'bottom',
            'blocked'
        );
    }

    spawnChest(chestObject) {
        // const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];
        const location = [chestObject.x * 2, chestObject.y * 2];

        let chest = this.chestGroup.getFirstDead();

        if (!chest) {
            // TODO: convert to object params
            chest = new Chest(
                this,
                location[0],
                location[1],
                'items',
                0,
                chestObject.gold,
                chestObject.id
            );
            // add chest to chests group
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
            monster = new Monster(
                this,
                monsterObject.x * 2,
                monsterObject.y * 2,
                'monsters',
                monsterObject.frame,
                monsterObject.id,
                monsterObject.health,
                monsterObject.maxHealth
            );

            this.monsterGroup.add(monster);
        } else {
            monster.id = monsterObject.id;
            monster.health = monsterObject.health;
            monster.maxHealth = monsterObject.maxHealth;
            monster.setTexture('monsters', monsterObject.frame);
            monster.setPosition(monsterObject.x * 2, monsterObject.y * 2);
            monster.makeActive();
        }
    }
}
