export class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, health, maxHealth) {
        super(scene, x, y, key, frame); 

        this.scene = scene;
        this.spawnerId = id; 
        this.health = health;
        this.maxHealth = maxHealth; 

        this.scene.physics.world.enable(this);
        this.setImmovable(false);
        this.setScale(2);
        this.setCollideWorldBounds(true);

        // add the monster to the existing scenes
        this.scene.add.existing(this);
    }


    // make Active/Inactive 
    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
    }

}