import { PlayerModel } from './PlayerModel.js';
import { Spawner } from './Spawner.js';
import { SpawnerType, getAnchorPoints } from './utils.js';

// Goal of GameManager
// This keeps track of all the elements and their IDs. If things aren't created, it makes it.
export class GameManager {
    constructor(scene, MapData) {
        this.scene = scene;
        this.MapData = MapData;

        this.sceneSpawners = {};
        this.sceneChests = {};
        this.sceneMonsters = {};
        this.scenePlayers = {};

        // TODO: rename these
        this.playerLocations = [];
        this.chestLocations = {};
        this.monsterLocations = {};
    }

    setup() {
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
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
        console.log({ monster });
    }

    deleteMonster(monsterId) {
        delete this.sceneMonsters[monsterId];
    }

    parseMapData() {
        // The parseMapData method will be used to parse the layer data that was exported from Tiled, which will be used to generate the three locations.

        // console.log(this.MapData); Will show all the objects made in Tiled.

        for (let layer of this.MapData) {
            // TODO: Refactor the if/else out
            // const layerType = ['player_locations', 'chest_locations', 'monster_locations'];
            if (layer.name === 'player_locations') {
                layer.objects.forEach((obj) => {
                    const playerCoordinates = getAnchorPoints(obj);

                    this.playerLocations.push([
                        playerCoordinates.x,
                        playerCoordinates.y,
                    ]);
                });
            } else if (layer.name === 'chest_locations') {
                // TODO: Maybe MAP?
                layer.objects.forEach((obj) => {
                    // const spawnProps = obj.properties.spawner; // TILED broke this
                    const spawnProps = obj.properties[0].value;
                    const spawnCoordinates = getAnchorPoints(obj);

                    if (this.chestLocations[spawnProps]) {
                        this.chestLocations[spawnProps].push([
                            spawnCoordinates.x,
                            spawnCoordinates.y,
                        ]);
                    } else {
                        this.chestLocations[spawnProps] = [
                            [spawnCoordinates.x, spawnCoordinates.y],
                        ];
                    }
                });
            } else if (layer.name === 'monster_locations') {

                // TODO: This spawner code seems fucked
                // It doesn't look like it's generating multiple spawn points.
                layer.objects.forEach((obj) => {
                    // const spawnProps = obj.properties.spawner;
                    const spawnProps = obj.properties[0].value;
                    const spawnCoordinates = getAnchorPoints(obj);

                    if (this.monsterLocations[spawnProps]) {
                        this.monsterLocations[spawnProps].push([
                            spawnCoordinates.x,
                            spawnCoordinates.y,
                        ]);
                    } else {
                        this.monsterLocations[spawnProps] = [
                            [spawnCoordinates.x, spawnCoordinates.y],
                        ];
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

                const { gold } = thisChest; 
                console.log({gold})

                // update player gold
                thePlayer.updateGold(gold);
                console.log({thePlayer})
                this.scene.events.emit('updateScore', thePlayer.gold)

                this.sceneSpawners[thisChest.spawnerId].removeObject(chestId);
                this.scene.events.emit('chestRemoved', chestId);
            }

        });

        this.scene.events.on('monsterAttacked', (monsterId) => {
            const thisMonster = this.sceneMonsters[monsterId];
            console.log('this.sceneMonsters:', this.sceneMonsters);            
            console.log('Attacking thisMonster:', thisMonster);

            if (thisMonster) {
                thisMonster.loseHealth();

                if (thisMonster.health <= 0) {
                    this.sceneSpawners[thisMonster.spawnerId].removeObject(
                        monsterId
                    );

                    this.scene.events.emit('monsterRemoved', monsterId);
                } else {

                    this.scene.events.emit('monsterTakingDamage', monsterId, thisMonster.health);
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

    // The goal of this code is to declare all the spawners for monsters and chests
    setupSpawners() {
        const monsterLimit = 4;
        const chestLimit = 10;

        // TODO: WTF is this code?
        Object.keys(this.chestLocations).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: chestLimit,
                objectType: SpawnerType.CHEST,
                id: `chest-${key}`,
            };
            // console.log(this.chestLocations);

            const spawner = new Spawner(
                config,
                this.chestLocations[key],
                this.addChest.bind(this),
                this.deleteChest.bind(this)
            );

            this.sceneSpawners[spawner.id] = spawner;
        });

        // monsters version
        Object.keys(this.monsterLocations).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: monsterLimit,
                objectType: SpawnerType.MONSTER,
                id: `monster-${key}`,
            };

            const spawner = new Spawner(
                config,
                this.monsterLocations[key],
                this.addMonster.bind(this),
                this.deleteMonster.bind(this)
            );

            // console.log(spawner);
            this.sceneSpawners[spawner.id] = spawner;
        });
    }

    spawnPlayer() {
        // console.log('spawn player starting');

        const player = new PlayerModel(this.playerLocations);
        this.scenePlayers[player.id] = player;

        this.scene.events.emit('spawnPlayer', player);
    }
}
