import { Spawner } from './Spawner.js';
import { SpawnerType, getAnchorPoints } from './utils.js';


// Goal of GameManager
// This keeps track of all the elements and their IDs. If things aren't created, it makes it.
export class GameManager {
    constructor(scene, MapData) {
        this.scene = scene;
        this.MapData = MapData;

        this.spawners = {};
        this.chests = {};
        this.monsters = {};

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
    // chests
    addChest(chestId, chest) {
        this.chests[chestId] = chest;
        this.scene.events.emit('chestSpawned', chest);
        console.log(chest);
    }

    deleteChest(chestId) {
        delete this.chests[chestId];
    }

    // monsters
    addMonster(monsterId, monster) {
        // console.log("am i in addMonster?");
        console.log(monster);
        this.monsters[monsterId] = monster;
        this.scene.events.emit('monsterSpawned', monster);

    }

    deleteMonster(monsterId) {
        delete this.monsters[monsterId];
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

                    this.playerLocations.push([playerCoordinates.x, playerCoordinates.y])

                });
            } else if (layer.name === 'chest_locations') {
                // TODO: Maybe MAP?
                layer.objects.forEach((obj) => {
                    // const spawnProps = obj.properties.spawner; // TILED broke this
                    const spawnProps = obj.properties[0].value;
                    const spawnCoordinates = getAnchorPoints(obj);

                    if (this.chestLocations[spawnProps]) {
                        this.chestLocations[spawnProps].push([spawnCoordinates.x, spawnCoordinates.y]);
                    } else {
                        this.chestLocations[spawnProps] = [[spawnCoordinates.x, spawnCoordinates.y]];                        
                    }
                });
            } else if (layer.name === 'monster_locations') {
                layer.objects.forEach((obj) => {
                    // const spawnProps = obj.properties.spawner;
                    const spawnProps = obj.properties[0].value;
                    const spawnCoordinates = getAnchorPoints(obj);                    

                    if (this.monsterLocations[spawnProps]) {
                        this.monsterLocations[spawnProps].push([spawnCoordinates.x, spawnCoordinates.y]);
                    } else {
                        this.monsterLocations[spawnProps] = [[spawnCoordinates.x, spawnCoordinates.y]];                        
                    }
                });
            }
        }


    }

    setupEventListener() {
        // The setupEventListener method will be used to create any event listeners that will need to be hooked up to the GameManager object, such as when a player picks up a chest.

        this.scene.events.on('pickUpChest', (chestId) => {
            if (this.chests[chestId]) {
                this.spawners[this.chests[chestId].spawnerId].removeObject(
                    chestId
                );
            }
        });

        this.scene.events.on('destroyEnemy', (monsterId) => {
            if (this.monsters[monsterId]) {
                this.spawners[this.monsters[monsterId].spawnerId].removeObject(monsterId);
            }
        })
    }

    // The goal of this code is to declare all the spawners for monsters and chests
    setupSpawners() {

        // TODO: WTF is this code?
        Object.keys(this.chestLocations).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: 3,
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

            this.spawners[spawner.id] = spawner;
        });

        // monsters version
        Object.keys(this.monsterLocations).forEach((key) => {
            const config = {
                spawnInterval: 3000,
                limit: 3,
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
              this.spawners[spawner.id] = spawner;
        });


    }

    spawnPlayer() {
        // console.log('spawn player starting');
        const location =
            this.playerLocations[
                Math.floor(Math.random() * this.playerLocations.length)
            ];
        this.scene.events.emit('spawnPlayer', location);
    }
}
