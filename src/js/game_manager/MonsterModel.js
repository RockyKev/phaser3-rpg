import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { randomNumber } from './utils.js'; // TODO: Delete this

export class MonsterModel {
    constructor({ x, y, gold, spawnerId, frame, health, attack }) {
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
        const distance = 64;

        // object literal version
        const directionalMovement = {
          'up': {x: 0, y: distance},
          "up-right": {x: distance, y: distance},
          'right': {x: distance, y: 0},
          "down-right": {x: distance, y: -distance},
          'down': {x: 0, y: -distance},
          "down-left": {x: -distance, y: -distance},
          'left': {x: -distance, y: 0},
          "up-left": {x: -distance, y: distance}
        };
      
        // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
        // const randomRirections = directions[randomNumber(1, 8)];
        var keys = Object.keys(directionalMovement);

        let move = { x: 0, y: 0 };
        move = directionalMovement[keys[ keys.length * Math.random() << 0 ]]; 

        this.x += move.x;
        this.y += move.y;
        
    }
}
