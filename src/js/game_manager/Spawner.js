import { ChestModel } from './ChestModel.js';
import { MonsterModel } from './MonsterModel.js';
import { randomNumber, SpawnerType } from './utils.js';

// Goal of the Spawner.js
// This 'spawns' the entity into the Scene.
// The spawner-id keeps track of the entity.
// add/remove functions are bound to the element.

export class Spawner {
    constructor(config, spawnLocations, addObject, deleteObject, moveObjects) {
        this.id = config.id;
        this.spawnInterval = config.spawnInterval;
        this.spawnLimit = config.limit;
        this.spawnLocations = spawnLocations;
        this.objectType = config.objectType;

        this.addObject = addObject;
        this.deleteObject = deleteObject;
        this.moveObjects = moveObjects;

        this.objectsCreated = [];

        this.start();
    }

    start() {
        this.interval = setInterval(() => {
            if (this.objectsCreated < this.spawnLimit) {
                this.determineSpawnType();
            }
        }, this.spawnInterval);

        if (this.objectType === SpawnerType.MONSTER) {
            this.moveMonsters();
        }
    }

    determineSpawnType() {
        // console.log("in determineSpawnType", this.objectType)
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if (this.objectType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }



    spawnChest() {
        const location = this.pickRandomLocation();
        const gold = randomNumber(10, 20);

         // TODO: Move this code into a object
        const chest = new ChestModel(location[0], location[1], gold, this.id);

        this.objectsCreated.push(chest);

        // this grabs the addObject function that's passed into here. (this.addObject)
        this.addObject(chest.id, chest);
    }

    spawnMonster() {
        const location = this.pickRandomLocation();

        // TODO: Move this code into a object
        const monster = new MonsterModel(
            location[0],
            location[1],
            randomNumber(10, 20), 
            this.id, 
            randomNumber(0, 20),
            randomNumber(3, 5),
            1
        )

        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }

    pickRandomLocation() {
        // TODO: This code smells
        const location =
            this.spawnLocations[
                Math.floor(Math.random() * this.spawnLocations.length)
            ];

        const invalidLocation = this.objectsCreated.some((obj) => {
            if (obj.x === location[0] && obj.y === location[1]) {
                return true;
            }

            return false;
        });

        // recursion
        if (invalidLocation) return this.pickRandomLocation();

        return location;
    }

    removeObject(id) {
        // this grabs the delete function that's passed into here. (this.deleteObject)
        this.objectsCreated = this.objectsCreated.filter(
            (obj) => obj.id !== id
        );
        this.deleteObject(id);
    }

    // This should be in the game manager?
    moveMonsters() {

        this.moveMonsterInterval = setInterval( () => {
            this.objectsCreated.forEach( (monster) => {
                monster.move();
            });

            this.moveObjects();
        }, 1000);
    }
}
