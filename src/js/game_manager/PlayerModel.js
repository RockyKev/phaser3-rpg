import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

export class PlayerModel {
    constructor(spawnLocations) {
        this.health = 10;
        this.maxHealth = 10;
        this.gold = 0;        
        this.id = `player-${uuidv4()}`;
        console
        this.spawnLocations = spawnLocations;

        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];

        [this.x, this.y] = location; 
    }
    
    updateGold(gold) {
        this.gold += gold;
    }

    updateHealth(health) {
        this.health += health;

        // so it never goes over the max health limit
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth; 
        }

        // console.log("PLAYER HEALTH", this.health);
    }

    respawnInstance() {
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        [this.x, this.y] = [ location[0] * 2, location[1] * 2];
        // console.log("this-x", this.x);
    }

}