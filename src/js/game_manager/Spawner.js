import { ChestModel } from "./ChestModel.js";
import { randomNumber, SpawnerType } from "./utils.js"

export class Spawner {
    constructor(config, spawnLocations, addObject, deleteObject ) {
 
        this.id = config.id;
        this.spawnInterval = config.spawnInterval;
        this.spawnLimit = config.limit;
        this.spawnLocations = spawnLocations;
        this.objectType = config.objectType;

        this.addObject = addObject;
        this.deleteObject = deleteObject;
        
        this.objectsCreated = [];

        this.start();
    }

    start() {
        this.interval = setInterval( () => {

            if (this.objectsCreated < this.spawnLimit ) {
                this.spawnObject();
            }

        }, this.spawnInterval);
    }

    spawnObject() {
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        }
    }

    spawnChest() {
        const location = this.pickRandomLocation();
        const gold = randomNumber(10,20);

        const chest = new ChestModel(location[0], location[1], gold, this.id);

        this.objectsCreated.push(chest);

        // this grabs the addObject function that's passed into here. (this.addObject)
        this.addObject(chest.id, chest);

    }

    pickRandomLocation(){

        // TODO: This code smells
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];

        const invalidLocation = this.objectsCreated.some( (obj) => {
            if (obj.x === location[0] && obj.y === location[1]) {
                return true;
            }

            return false; 
        })

        if (invalidLocation) return this.pickRandomLocation();

        return location; 

    }

    removeObject(id) {
        // this grabs the delete function that's passed into here. (this.deleteObject)
        this.objectsCreated = this.objectsCreated.filter(obj => obj.id !== id);
        this.deleteObject(id);
    }

}