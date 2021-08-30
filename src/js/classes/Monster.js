export class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, key, frame, id, health, maxHealth) {

        super(scene, x, y, key, frame); 

        this.scene = scene;
        // TODO: In Chest.js this should be switched to spawnerId, instanceID, or explain in more details
        // TODO: BUG - It's also a bug here. this is supposed to be the group ID. When enemies die it doesn't update this.
        this.spawnerId = id; 
        // this.id = id; 

        this.health = health;
        this.maxHealth = maxHealth; 

        this.scene.physics.world.enable(this);
        this.setImmovable(false);
        this.setScale(2);
        this.setCollideWorldBounds(true);

        // add the monster to the existing scenes
        this.scene.add.existing(this);
        this.setOrigin(0);

        this.createHealthBar();
    }

    update() {
        this.updateHealthBar();
    }

    // make Active/Inactive 
    makeActive() {
        this.setActive(true);
        this.setVisible(true);
        this.body.checkCollision.none = false;
        this.updateHealthBar();
    }

    makeInactive() {
        this.setActive(false);
        this.setVisible(false);
        this.body.checkCollision.none = true;
        this.healthBar.clear();
    }

    // health bar
    createHealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

    }

    updateHealthBar() {
        this.healthBar.clear();

        // this is the white part behind the healthbar
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x, this.y - 8, 64, 5);

        // this is the health itself
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.x, this.y - 8, 64 * (this.health / this.maxHealth), 5)

    }

    updateHealth(health) {
        this.health = health; 
        this.updateHealthBar();
    }

}