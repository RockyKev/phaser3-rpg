import { PlayerContainer } from '../classes/player/PlayerContainer.js';
import { Chest } from '../classes/Chest.js';
import { Monster } from '../classes/Monster.js';
import { Map } from '../classes/Map.js';
import { GameManager } from '../game_manager/GameManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.scene.launch('Ui');
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

    createMap() {
        // generate the map graphics
        this.map = new Map({
            scene: this,
            tileMapkey: 'tilesetJSON',
            tileSetName: 'tilesetPNG',
            bottomLayerName: 'bottom',
            blockedLayerName: 'blocked',
        });

        // TODO: migrate this to GameManager so it lives inder locationOfEvents
        // generate the events layer
        // console.log("maps", this);
        this.locationsOfEvents = {};

        const eventsLayer = this.map.map.objects.filter(
            (objectLayer) => objectLayer.name === 'event_locations'
        );
        const events = eventsLayer[0].objects;

        // console.log("eventsLayer", eventsLayer)
        console.log('events', events);

        for (const event of events) {
            // create the graphic location
            const eventProps = {
                x: event.x,
                y: event.y,
                eventType: event.type,
                eventAction: event.properties[0].name,
                eventValue: event.properties[0].value,
            };

            this.locationsOfEvents[event.name] = eventProps;

            // create the graphic
            // x y is doubled -- imaage size is doubled too
            let graphic = this.add.image(eventProps.x * 2, eventProps.y * 2, 'itemsSpriteSheet', 9);
            graphic.setScale(2).setOrigin(0,1);
            console.log("image should be made")


            // create the 'trigger'


        }



        //layer = this.map.map.objects
        //     else if (layer.name === mapLayer.events) {

        //         layer.objects.forEach((obj) => {

        //          // TODO: we might want to check the type of event.
        //          // Event types SO FAR:
        //          // warp - takes you to another place. Doors, warpgates, stairs.
        //          // flag-character - sets a character flag
        //          // flag-quest - sets a quest event flag
        //          // flag-instance - sets a instance flag (resets after you leave the area)
        //          // flag-world - sets a world flag (never resets)
        //          // dialog - show text
        //          // display - a visual effect.

        //          const eventName = obj.name;

        //          // console.log('events', eventName);
        //          // console.log('events obj', obj);

        //          const eventProps = {
        //              x: obj.x,
        //              y: obj.y,
        //              eventType: obj.type,
        //              eventAction: obj.properties[0].name,
        //              eventValue: obj.properties[0].value
        //          };

        //          this.locationsOfEvents[eventName] = eventProps;

        //      });

        //      console.log('this.locationsOfEvents', this.locationsOfEvents);
        console.log('maps', this);
        //  }
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

    createGroups() {
        this.chestGroup = this.physics.add.group();
        this.monsterGroup = this.physics.add.group();

        // this feature causes update() to run automatically
        this.monsterGroup.runChildUpdate = true;
    }

    createGameManager() {
        // TODO: When does an event appear in GameScenes VS GameManager?
        // maybe when the scene needs to be cleaned.

        // TODO: Create a addEventListener method?
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
            const chestGroup = this.chestGroup.getChildren();

            chestGroup.forEach((chest) => {
                if (chest.id === chestId) {
                    chest.makeInactive();
                }
            });
        });

        this.events.on('monsterRemoved', (monsterId) => {
            // make monster inactive on event monsterRemoved
            const monsterGroup = this.monsterGroup.getChildren();

            monsterGroup.forEach((monster) => {
                if (monster.id === monsterId) {
                    console.log(
                        `MONSTER DESTROYED: Comparison-> ${monster.id}->${monsterId}`
                    );

                    this.monsterDeathAudio.play();
                    monster.makeInactive();
                }
            });
        });

        this.events.on('monsterUpdateHealth', (monsterId, health) => {
            const monsterGroup = this.monsterGroup.getChildren();

            monsterGroup.forEach((monster) => {
                if (monster.id === monsterId) {
                    monster.updateHealth(health);
                }
            });
        });

        this.events.on('playerUpdateHealth', (health) => {
            if (health < this.playerHealth) {
                this.playerDeathAudio.play();
            }
            this.player.updateHealth(health);
        });

        this.events.on('playerRespawn', (playerObject) => {
            this.playerDeathAudio.play();
            this.player.respawn(playerObject);
        });

        this.events.on('monsterMovement', (sceneMonsters) => {
            const monsterGroup = this.monsterGroup.getChildren();

            monsterGroup.forEach((monster) => {
                if (sceneMonsters[monster.id]) {
                    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html#moveToObject__anchor
                    this.physics.moveToObject(
                        monster,
                        sceneMonsters[monster.id],
                        40
                    );
                }
            });
        });

        const scene = this;
        const mapData = this.map.map.objects;
        this.gameManager = new GameManager(scene, mapData);
        this.gameManager.setup();
    }

    // UTILS

    createInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    addCollisions() {
        // add a collider between the monster and the blocked layer. That way the monsters won’t be moving over the blocked tiles
        // check for collisions between player and wall objects

        // check for collisions beteen player and tiled block layer
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
        if (this.player.playerAttacking && !this.player.swordHit) {
            this.player.swordHit = true;

            // One hit kill
            // enemy.makeInactive();
            // this.events.emit('destroyEnemy', enemy.id);

            // with health points
            console.log('weapon hitting', weapon);
            console.log('sword hitting this enemy->', enemy);
            this.events.emit('monsterAttacked', enemy.id, this.player.id);
        }
    }

    // ACTIONS

    createPlayer(playerObject) {
        this.player = new PlayerContainer({
            scene: this,
            x: playerObject.x * 2,
            y: playerObject.y * 2,
            key: 'link',
            frame: 0,
            health: playerObject.health,
            maxHealth: playerObject.maxHealth,
            id: playerObject.id,
            attackAudio: this.playerAttackAudio,
        });

        // console.log(this.player);
    }

    collectChest(player, chest) {
        this.goldPickupAudio.play();

        this.events.emit('pickUpChest', chest.id, player.id);
    }

    spawnChest(chestObject) {
        const location = [chestObject.x * 2, chestObject.y * 2];

        let chest = this.chestGroup.getFirstDead();

        if (!chest) {
            chest = new Chest({
                scene: this,
                x: location[0],
                y: location[1],
                key: 'itemsSpriteSheet',
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
                key: 'monsterSpritesheet',
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
            monster.setTexture('monsterSpritesheet', monsterObject.frame);
            monster.setPosition(monsterObject.x, monsterObject.y);
            monster.makeActive();
        }
    }
}
