import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export class ChestModel {
    constructor({x, y, gold, spawnerId}) {
        // tracks which spawner this belongs to
        // TODO: BUG: New chests don't seem to be pickup-able
        this.spawnerId = spawnerId;

        this.id = `${spawnerId}-${uuidv4()}`;
        this.x = x;
        this.y = y;
        this.gold = gold;
    }
}
