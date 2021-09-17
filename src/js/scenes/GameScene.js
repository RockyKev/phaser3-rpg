import { PlayerContainer } from '../classes/player/PlayerContainer.js';
import { Chest } from '../classes/Chest.js';
import { Monster } from '../classes/Monster.js';
import { Map } from '../classes/Map.js';
import { TriggerEvent } from '../classes/TriggerEvent.js';
import { GameManager } from '../game_manager/GameManager.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.scene.launch('Ui');
        this.debug = true;
    }

    create() {

        this.createGroups();
        this.createMap();
        this.createAudio();
        this.createInput();
        this.createEventListeners();
        this.createGameManager();
        this.createDebugKeys();
    }

    update(time, delta) {
        if (this.player) this.player.update(this.cursors);

        
        if (this.debug) {
            this.cameraControl.update(delta);
        }
    }


    
    createDebugKeys() {

        if (!this.debug) return

        console.log("%cWE ARE IN DEBUG MODE",  'color: blue; font-size: x-large');
        const debugText = (text) => {
            console.log(`%c${text}`,  'color: blue; font-weight: bold');
        }

        debugText('Zoom: numpad 7 & numpad 9');
        debugText('ShowSceneCode: Z');
        debugText('Full HP + GOLD: X')

        // https://labs.phaser.io/edit.html?src=src/camera/move%20camera%20with%20keys.js
        const cameraControlConfig = {
            // left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR),
            // right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX), 
            // up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT), 
            // down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO), 
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE),
            acceleration: 0.06,
            drag: 0.0005,
            maxSpeed: 1.0,
            camera: this.cameras.main,
        }
        this.cameraControl = new Phaser.Cameras.Controls.SmoothedKeyControl(cameraControlConfig);

        // https://labs.phaser.io/edit.html?src=src/input/keyboard/keydown.js
        this.input.keyboard.on('keydown-Z', function (event) {
            console.log('showing this scene');
            console.log(this.scene);
        });
    
        this.input.keyboard.on('keydown-X', function (event) {
            console.log('Full HP + Gold');

            const playerID = Object.entries(this.scene.gameManager.InstancesOfPlayers)[0][0];
            this.scene.events.emit('pickUpHealth', 10, playerID);
            this.scene.events.emit('pickUpMoney', 1000, playerID);
            console.log({player})
            
        });

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

        console.log('Scene THIS', this);
    }

    createAudio() {
        const defaultOpts = {
            loop: false,
            volume: 0.2,
        };

        this.sfxGoldPickup = this.sound.add('goldSound', defaultOpts);
        this.sfxPlayerAttack = this.sound.add('playerAttack', defaultOpts);
        this.sfxPlayerDamage = this.sound.add('playerDamage', defaultOpts);
        this.sfxPlayerDeath = this.sound.add('playerDeath', defaultOpts);
        this.sfxMonsterDeath = this.sound.add('enemyDeath', defaultOpts);
    }

    createGroups() {
        this.physicsGroupChests = this.physics.add.group();
        this.physicsGroupMonsters = this.physics.add.group();
        this.physicsGroupTriggerEvents = this.physics.add.group();

        // this feature causes update() to run automatically
        this.physicsGroupMonsters.runChildUpdate = true;
    }

    createEventListeners() {
        this.events.on('spawnPlayer', (playerObject) => {
            this.player = new PlayerContainer({
                scene: this,
                x: playerObject.x * 2,
                y: playerObject.y * 2,
                key: 'link',
                frame: 0,
                health: playerObject.health,
                maxHealth: playerObject.maxHealth,
                id: playerObject.id,
                attackAudio: this.sfxPlayerAttack,
            });

            this.addCollisions();
        });

        this.events.on('spawnTriggerEvents', (event) => {
            let triggerEvent = new TriggerEvent({
                scene: this,
                x: event.x * 2,
                y: event.y * 2,
                id: event.name,
                key: 'itemsSpriteSheet',
                frame: 9,
            });

            this.physicsGroupTriggerEvents.add(triggerEvent);
        });

        this.events.on('chestSpawned', (chest) => {
            this.spawnChest(chest);
        });

        this.events.on('monsterSpawned', (monster) => {
            this.spawnMonster(monster);
        });

        this.events.on('chestRemoved', (chestId) => {
            const physicsGroupChests = this.physicsGroupChests.getChildren();

            // TODO: this is a perfect opt to filter.
            physicsGroupChests.forEach((chest) => {
                if (chest.id === chestId) {
                    chest.makeInactive();
                }
            });
        });

        this.events.on('monsterRemoved', (monsterId) => {
            // make monster inactive on event monsterRemoved
            const physicsGroupMonsters =
                this.physicsGroupMonsters.getChildren();

            physicsGroupMonsters.forEach((monster) => {
                if (monster.id === monsterId) {
                    console.log(
                        `MONSTER DESTROYED: Comparison-> ${monster.id}->${monsterId}`
                    );

                    this.sfxMonsterDeath.play();
                    monster.makeInactive();
                }
            });
        });

        this.events.on('monsterUpdateHealth', (monsterId, health) => {
            const physicsGroupMonsters =
                this.physicsGroupMonsters.getChildren();

            physicsGroupMonsters.forEach((monster) => {
                if (monster.id === monsterId) {
                    monster.updateHealth(health);
                }
            });
        });

        this.events.on('playerUpdateHealth', (health) => {
            if (health < this.playerHealth) {
                this.sfxPlayerDeath.play();
            }
            this.player.updateHealth(health);
        });

        this.events.on('playerRespawn', (playerObject) => {
            this.sfxPlayerDeath.play();
            this.player.respawn(playerObject);
        });

        this.events.on('monsterMovement', (InstancesOfMonsters) => {
            const physicsGroupMonsters =
                this.physicsGroupMonsters.getChildren();

            physicsGroupMonsters.forEach((monster) => {
                if (InstancesOfMonsters[monster.id]) {
                    // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html#moveToObject__anchor
                    this.physics.moveToObject(
                        monster,
                        InstancesOfMonsters[monster.id],
                        40
                    );
                }
            });
        });
    }

    createGameManager() {
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
        // check for collisions beteen player and tiled block layer
        this.physics.add.collider(this.player, this.map.blockedLayer);

        // check for collisions between monster group and tiled block layer
        this.physics.add.collider(
            this.physicsGroupMonsters,
            this.map.blockedLayer
        );

        // check for collision between player's weapon and monster group
        this.physics.add.overlap(
            this.player.weapon,
            this.physicsGroupMonsters,
            this.enemyOverlap,
            null,
            this
        );

        // check for overlaps between player and chest game objects
        this.physics.add.overlap(
            this.player,
            this.physicsGroupChests,
            this.collectChest,
            null,
            this
        );

        // check collision over player and event triggers
        this.physics.add.overlap(
            this.player,
            this.physicsGroupTriggerEvents,
            this.triggerEventOverlap,
            null,
            this
        );
    }

    // This can be used to deal with player overlapping with
    // Will have to do a diff one for items, or with enemy as well
    triggerEventOverlap(player, elementTouched) {
        //          // TODO: we might want to check the type of event.
        //          // Event types SO FAR:
        //          // warp - takes you to another place. Doors, warpgates, stairs.
        //          // flag-character - sets a character flag
        //          // flag-quest - sets a quest event flag
        //          // flag-instance - sets a instance flag (resets after you leave the area)
        //          // flag-world - sets a world flag (never resets)
        //          // dialog - show chatbox text
        //          // display - a visual effect.
        //          // effect - damage dealing or healing

        // find the locationOfEvents
        const elementData =
            this.gameManager.locationOfTriggerEvents[elementTouched.id];

        if (elementData) {
            // TODO: Move this to utils.js
            const EventWarps = {
                goto: {
                    old_mans_cave: [1000, 1000],
                    monsters_cave: [1500, 1500],
                    dungeon: [2390, 2500],
                },
                changeScene: {},
            };

            if (elementData.eventType === 'warp') {
                const action = elementData.eventAction;
                const value = elementData.eventValue;
                const [x, y] = EventWarps[action][value];
                this.player.setPosition(x, y);
            }
        }
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

    // TODO: refactor this into the playerOverlap function
    collectChest(player, chest) {
        this.sfxGoldPickup.play();

        this.events.emit('pickUpChest', chest.id, player.id);
    }

    spawnChest(chestObject) {
        const location = [chestObject.x * 2, chestObject.y * 2];

        let chest = this.physicsGroupChests.getFirstDead();

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

            this.physicsGroupChests.add(chest);
        } else {
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }
    }

    spawnMonster(monsterObject) {
        let monster = new Monster({
            scene: this,
            x: monsterObject.x,
            y: monsterObject.y,
            key: 'monsterSpritesheet',
            frame: monsterObject.frame,
            id: monsterObject.id,
            health: monsterObject.health,
            maxHealth: monsterObject.maxHealth,
        });

        // monster.makeActive();
        this.physicsGroupMonsters.add(monster);

        // let monster = this.physicsGroupMonsters.getFirstDead();

        // if (!monster) {
        //     monster = new Monster({
        //         scene: this,
        //         x: monsterObject.x,
        //         y: monsterObject.y,
        //         key: 'monsterSpritesheet',
        //         frame: monsterObject.frame,
        //         id: monsterObject.id,
        //         health: monsterObject.health,
        //         maxHealth: monsterObject.maxHealth,
        //     });

        //     this.physicsGroupMonsters.add(monster);
        // } else {
        //     monster.id = monsterObject.id;
        //     monster.health = monsterObject.health;
        //     monster.maxHealth = monsterObject.maxHealth;
        //     monster.setTexture('monsterSpritesheet', monsterObject.frame);
        //     monster.setPosition(monsterObject.x, monsterObject.y);
        //     monster.makeActive();
        // }
    }
}
