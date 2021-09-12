import { PlayerModel } from './PlayerModel.js';
import { Spawner } from './Spawner.js';
import { SpawnerType } from './utils.js';

// Goal of GameManager
// This keeps track of all the elements and their IDs. If things aren't created, it makes it.

// This can change based on map? Maybe iduno.
const mapLayer = Object.freeze({
    player: 'player_locations',
    items: 'chest_locations',
    monsters: 'monster_locations',
    events: 'event_locations'
})

export class GameManager {
    constructor(scene, mapData) {
        this.scene = scene;
        this.mapData = mapData;

        this.sceneSpawners = {};
        this.sceneChests = {};
        this.sceneMonsters = {};
        this.scenePlayers = {};

        this.locationOfPlayer = [];
        this.locationOfChests = {};
        this.locationOfMonsters = {};
        // this.locationsOfEvents = {};
    }

    setup() {
        this.parseMapData();
        // this.generateEvents();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }


    parseMapData() {
        // The parseMapData method will be used to parse the layer data that was exported from Tiled, which will be used to generate the three layers. 

        // console.log(this.mapData); Will show all the objects made in Tiled.
        // console.log("mapdata", this.mapData)

        for (let layer of this.mapData) {

            if (layer.name === mapLayer.player) {
                
                layer.objects.forEach((obj) => this.locationOfPlayer.push([obj.x, obj.y]) );

            } else if (layer.name === mapLayer.items) {
                // TODO: Maybe MAP?
                layer.objects.forEach(
                    (obj) => {
                    const spawnProps = obj.properties[0].value;

                    if (this.locationOfChests[spawnProps]) {
                    this.locationOfChests[spawnProps].push([obj.x, obj.y]);

                    } else {
                        this.locationOfChests[spawnProps] = [[obj.x, obj.y]];
                    }

                })

            } else if (layer.name === mapLayer.monsters) {

                layer.objects.forEach((obj) => {
                    const spawnProps = obj.properties[0].value;

                    console.log('monster_locations', spawnProps);

                    if (this.locationOfMonsters[spawnProps]) {
                        this.locationOfMonsters[spawnProps].push([obj.x, obj.y]);
                      } else {
                        this.locationOfMonsters[spawnProps] = [[obj.x, obj.y]];
                      }
                });
            }
        }
    }

    setupEventListener() {
        // TODO: When is it a GameManager event, and when is it a GameScene event? 

        // The setupEventListener method will be used to create any event listeners that will need to be hooked up to the GameManager object, such as when a player picks up a chest.

        this.scene.events.on('pickUpChest', (chestId, playerId) => {
            const thisChest = this.sceneChests[chestId];
            const thePlayer = this.scenePlayers[playerId];

            if (thisChest && thePlayer) {

                // update player gold
                thePlayer.updateGold(thisChest.gold);

                this.scene.events.emit('updateUIGold', thePlayer.gold)

                this.scene.events.emit('chestRemoved', chestId);
                this.sceneSpawners[thisChest.spawnerId].removeObject(chestId);
            }

        });

        this.scene.events.on('monsterAttacked', (monsterId, playerId) => {
            const thisMonster = this.sceneMonsters[monsterId];
            const thisPlayer = this.scenePlayers[playerId];

            // update the monsterInstance
            if (thisMonster) {
                thisMonster.loseHealth();

                if (thisMonster.health <= 0) {

                    console.log("this sceneSpawners", this.sceneSpawners)
                    // update score
                    thisPlayer.updateGold(thisMonster.gold);
                    this.scene.events.emit('updateUIGold', thisPlayer.gold)

                    // remove it
                    this.scene.events.emit('monsterRemoved', monsterId);
                    this.sceneSpawners[thisMonster.spawnerId].removeObject(monsterId);

                    // add bonus health to the player
                    thisPlayer.updateHealth(2);
                    this.scene.events.emit('playerUpdateHealth', thisPlayer.health);

                } else {

                    
                    // monster auto-attacks players back
                    thisPlayer.updateHealth( -thisMonster.attack )
                    this.scene.events.emit('playerUpdateHealth', thisPlayer.health);
                    this.scene.events.emit('monsterUpdateHealth', monsterId, thisMonster.health);
                    
                    // TODO: do the health check somewhere else?
                    if (thisPlayer.health <= 0) {
                        
                        thisPlayer.updateGold( parseInt(-thisPlayer.gold / 2));
                        this.scene.events.emit('updateUIGold', thisPlayer.gold);

                        // respawn the player
                        thisPlayer.respawnInstance();
                        this.scene.events.emit('playerRespawn', thisPlayer);
                    }

                }
            }
        });

        this.scene.events.on('destroyEnemy', (monsterId) => {
            if (this.sceneMonsters[monsterId]) {
                const sceneMonsters = this.sceneMonsters[monsterId];
                this.sceneSpawners[sceneMonsters.spawnerId].removeObject(
                    monsterId
                );
            }
        });
    }

    setupSpawners() {
        const monsterLimit = 4;
        const chestLimit = 4;

        console.log("this.locationOfChests", this.locationOfChests)

        // TODO: WTF is this code? Potentially switch to maps or use for in 
        // https://www.reddit.com/r/javascript/comments/8emf94/forin_vs_objectkeys/dxwecvs?utm_source=share&utm_medium=web2x&context=3
        Object.keys(this.locationOfChests).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: chestLimit,
                objectType: SpawnerType.CHEST,
                id: `chest-${key}`,
            };
            // console.log(this.locationOfChests);

            const spawner = new Spawner(
                config,
                this.locationOfChests[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this)
            );

            this.sceneSpawners[spawner.id] = spawner;
        });

        // monsters version
        Object.keys(this.locationOfMonsters).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: monsterLimit,
                objectType: SpawnerType.MONSTER,
                id: `monster-${key}`,
            };

            const spawner = new Spawner(
                config,
                this.locationOfMonsters[key],
                this.addMonster.bind(this),
                this.deleteMonster.bind(this),
                this.moveMonsters.bind(this)
            );

            // console.log(spawner);
            this.sceneSpawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        const player = new PlayerModel(this.locationOfPlayer);
        this.scenePlayers[player.id] = player;

        this.scene.events.emit('spawnPlayer', player);
    }


    // AUTOMATIC ACTIONS
    moveMonsters() {
        this.scene.events.emit('monsterMovement', this.sceneMonsters);
    }
    
    // METHODS THAT GET BINDED
    // sceneChests
    addChest(chestId, chest) {
        this.sceneChests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
        console.log({ chest });
    }

    deleteChest(chestId) {
        delete this.sceneChests[chestId];
    }

    // sceneMonsters
    addMonster(monsterId, monster) {
        this.sceneMonsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);
        // console.log({ monster });
        console.log("addMonster", monster );
    }

    deleteMonster(monsterId) {
        delete this.sceneMonsters[monsterId];
    }

}
