// TODO: same as ChestModel - figure out how to properly import UUID
// import {uuid} from 'https://cdnjs.cloudflare.com/ajax/libs/node-uuid/1.4.8/uuid.min.js';

export class MonsterModel {
    constructor(x, y, gold, spawnerId, frame, health, attack) {

        this.id = `${spawnerId}-${uuid.v4()}`

        this.x = x * 2;
        this.y = y * 2;
        this.gold = gold;
        this.frame = frame;
        this.health = health; 
        this.maxHealth = health; 
        this.attack = attack; 
    }
}