// TODO: same as ChestModel - figure out how to properly import UUID
// import {uuid} from 'https://cdnjs.cloudflare.com/ajax/libs/node-uuid/1.4.8/uuid.min.js';
import { randomNumber } from './utils.js';

export class MonsterModel {
    constructor(x, y, gold, spawnerId, frame, health, attack) {

        this.id = `${spawnerId}-${uuid.v4()}`;
        
        
        this.spawnerId = spawnerId;

        this.x = x * 2;
        this.y = y * 2;
        this.gold = gold;
        this.frame = frame;
        this.health = health; 
        this.maxHealth = health; 
        this.attack = attack; 
    }

    loseHealth() {
        // console.log("Enemy HP: " + (this.health - 1) + " / " + this.health + " left.");
        this.health -= 1;
    }

    move() {

        const randomPosition = randomNumber(1, 8);
        const distance = 64;

        // TODO: WTF IS THIS.
        switch (randomPosition) {
            case 1:
              this.x += distance;
              break;
            case 2:
              this.x -= distance;
              break;
            case 3:
              this.y += distance;
              break;
            case 4:
              this.y -= distance;
              break;
            case 5:
              this.x += distance;
              this.y += distance;
              break;
            case 6:
              this.x += distance;
              this.y -= distance;
              break;
            case 7:
              this.x -= distance;
              this.y += distance;
              break;
            case 8:
              this.x -= distance;
              this.y -= distance;
              break;
            default:
              break;
          }

        

    }
}