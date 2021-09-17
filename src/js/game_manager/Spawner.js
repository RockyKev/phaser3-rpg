import { ChestModel } from './ChestModel.js';
import { MonsterModel } from './MonsterModel.js';
import { randomNumber, SpawnerType } from './utils.js';

// Goal of the Spawner.js
// This 'spawns' the entity into the Scene.
// The spawner-id keeps track of the entity.
// add/remove functions are bound to the element.


export class Spawner {
    // constructor(config, spawnLocations, addObject, deleteObject, moveObject) {
        constructor({config, spawnLocations, addObject, deleteObject, moveObject}) {

        this.id = config.id;
        this.type = config.type;
        this.spawnInterval = config.spawnInterval;
        this.spawnLimit = config.limit;
        this.spawnLocations = spawnLocations;
        this.objectType = config.objectType;

        this.addObject = addObject;
        this.deleteObject = deleteObject;
        this.moveObject = moveObject;

        this.objectsCreated = [];

        this.start();
    }

    start() {

        this.spawnObjectBasedOnType();

        if (this.objectType === SpawnerType.MONSTER) {
            this.moveMonsters();
        }
    }

    spawnObjectBasedOnType() {
        // console.log("in determineSpawnType", this.objectType)
        if (this.objectType === SpawnerType.CHEST) {
            this.spawnChest();
        } else if (this.objectType === SpawnerType.MONSTER) {
            this.spawnMonster();
        }
    }

    spawnChest() {
        // const location = this.pickRandomLocation();
        const location = this.spawnLocations[0];
        const gold = randomNumber(10, 20);

        const chest = new ChestModel({x: location[0], y: location[1], gold: gold, spawnerId: this.id})

        this.objectsCreated.push(chest);

        this.addObject(chest.id, chest);
    }

    spawnMonster() {
        // TODO: Make this not suck so bad
        // assuming there's 16 tiles per row. 
        const row = (x) => 16 * x;
        const monsterFrame = {
            peahat:  row(1) + 1,
            tektite: row(2) + 1,
            octorok: row(3) + 1,
            moblin: row(6) + 1,
            lynel: row(9) + 1,
            armos: row(11) + 1,
            leever: row(8) + 1
        };


        const location = this.spawnLocations[0];

        const monster = new MonsterModel({
            x: location[0],
            y: location[1],
            gold: randomNumber(10, 20),
            spawnerId: this.id,
            type: this.type,
            frame: monsterFrame[this.type],    
            health: randomNumber(3, 5),
            attack: 1,
        });



        this.objectsCreated.push(monster);
        this.addObject(monster.id, monster);
    }


    removeObject(id) {
        // this grabs the delete function that's passed into here. (this.deleteObject)
        console.log('deleting this object', id);
        this.objectsCreated = this.objectsCreated.filter(
            (obj) => obj.id !== id
        );
        this.deleteObject(id);
    }

    // TODO: This is more like ACTION FUNCTION
    // Maybe this is more to initialize them AI, but for now... it's just moving.
    moveMonsters() {
        this.moveMonsterInterval = setInterval(() => {
            this.objectsCreated.forEach((monster) => {

          
                // THIS IS SAYING - In ModelMonster.js -> run their behavior function.
                monster.move();
            });

            // THIS IS SAYING
            // get each PhysicsGroupMonsters and move them to GameManager->InstanceOfMonsters's destination

            // this.scene.events.emit('monsterMovement', this.InstancesOfMonsters);
            // physicsGroupMonsters.forEach((monster) => {
            //     if (InstancesOfMonsters[monster.id]) {
            //         // https://photonstorm.github.io/phaser3-docs/Phaser.Physics.Arcade.ArcadePhysics.html#moveToObject__anchor
            //         this.physics.moveToObject( monster, InstancesOfMonsters[monster.id], 40 );
            //     }
            // });
            this.moveObject();
        }, 4000);
    }
}
