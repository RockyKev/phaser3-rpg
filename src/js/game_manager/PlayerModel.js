export class PlayerModel {
    constructor(spawnLocations) {
        this.health = 1;
        this.maxHealth = 10;
        this.gold = 0;        
        this.id = `player-${uuid.v4()}`;
        console
        this.spawnLocations = spawnLocations;

        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];

        [this.x, this.y] = location; 
        console.log("player this", this)

    }
    
    updateGold(gold) {
        this.gold += gold;
    }

    updateHealth(health) {
        this.health += health;
        console.log("PLAYER HEALTH", this.health);
    }

    respawnInstance() {
        this.health = this.maxHealth;
        const location = this.spawnLocations[Math.floor(Math.random() * this.spawnLocations.length)];
        [this.x, this.y] = [ location[0] * 2, location[1] * 2];
        console.log("this-x", this.x);

    }

}