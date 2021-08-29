export class PlayerModel {
    constructor(spawnLocations) {
        this.health = 10;
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

}