import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { randomNumber } from './utils.js';

export class MonsterModel {
    constructor({x, y, gold, spawnerId, frame, health, attack}) {

        this.id = `${spawnerId}-${uuidv4()}`;
        
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
        const positions = [
          'up',
          'up-right',
          'right', 
          'down-right',
          'down',
          'down-left',
          'left',
          'up-left'
        ]
        
        const randomPosition = positions[randomNumber(1, 8)];
        const distance = 64;
 
        switch (randomPosition) {
          case "left":
            this.x += distance;
            break;
          case "right":
            this.x -= distance;
            break;
          case "up":
            this.y += distance;
            break;
          case "down":
            this.y -= distance;
            break;
          case "up-right":
            this.x += distance;
            this.y += distance;
            break;
          case "down-right":
            this.x += distance;
            this.y -= distance;
            break;
          case "up-left":
            this.x -= distance;
            this.y += distance;
            break;
          case "down-right":
            this.x -= distance;
            this.y -= distance;
            break;
          default:
            break;
        }
  
    }
}