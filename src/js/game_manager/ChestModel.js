// TODO: figure out how to properly import UUID
// import {uuid} from 'https://cdnjs.cloudflare.com/ajax/libs/node-uuid/1.4.8/uuid.min.js';

export class ChestModel {
    constructor(x, y, gold, spawnerId) {
        // tracks which spawner this belongs to
        this.spawnerId = spawnerId;

        this.id = `${spawnerId}-${uuid.v4()}`;
        this.x = x;
        this.y = y;
        this.gold = gold;
    }
}
