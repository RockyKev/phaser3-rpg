import { Player } from './Player.js';

const direction = {
    RIGHT: 'RIGHT', 
    LEFT: 'LEFT', 
    UP: 'UP', 
    DOWN: 'DOWN'
}

// export class PlayerContainer extends Phaser.Physics.Arcade.Image {
export class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame, health, maxHealth, id, attackAudio) {
        super(scene, x, y);
        this.scene = scene; // the scene this container will be added to
        this.velocity = 400; // DEFAULT was 160 -- the velocity when moving our player
        this.currentDirection = direction.RIGHT;
        this.playerAttacking = false;
        this.flipX = true; 
        this.swordHit = false;

        // health and ID
        this.health = health;
        this.maxHealth = maxHealth; 
        this.id = id; 

        this.attackAudio = attackAudio; 

        // set the size of our container
        this.setSize(64, 64);

        // enable physics
        this.scene.physics.world.enable(this);

        // collide with world bounds
        this.body.setCollideWorldBounds(true);

        // add the player to our existing scene       // have the camera follow the player
        this.scene.add.existing(this);
        this.scene.cameras.main.startFollow(this);

        // create the player
        this.player = new Player(this.scene, 0, 0, key, frame);
        this.add(this.player);

        // create the weapon game object
        this.weapon = this.scene.add.image(40, 0, 'items', 4);
        this.scene.add.existing(this.weapon);
        this.weapon.setScale(1.5);
        this.scene.physics.world.enable(this.weapon);
        this.add(this.weapon);
        this.weapon.alpha = 0;

        this.createhealthBar();
    }

    // TODO: This shit is bananas
    update(cursors) {
        this.body.setVelocity(0);

        const key = {
            PRESS_LEFT: cursors.left.isDown,
            PRESS_RIGHT: cursors.right.isDown,
            PRESS_UP: cursors.up.isDown,
            PRESS_DOWN: cursors.down.isDown,
            PRESS_ATTACK: Phaser.Input.Keyboard.JustDown(cursors.space)
        };

        const weaponPosition = {
            RIGHT: [40, 0], 
            LEFT: [-40, 0], 
            UP: [0, -40], 
            DOWN: [0, 40]
        }

        // MOVEMENT - Y direction
        if (key.PRESS_LEFT) {
            this.body.setVelocityX(-this.velocity);
            this.currentDirection = direction.LEFT; 
            this.weapon.setPosition(...weaponPosition.LEFT)
            this.player.flipX = false;
        } else if (key.PRESS_RIGHT) {
            this.body.setVelocityX(this.velocity);
            this.currentDirection = direction.RIGHT; 
            this.weapon.setPosition(...weaponPosition.RIGHT)
            this.player.flipX = true;
        }

        // MOVEMENT - X direction
        if (key.PRESS_UP) {
            this.body.setVelocityY(-this.velocity);
            this.currentDirection = direction.UP; 
            this.weapon.setPosition(...weaponPosition.UP)
        } else if (key.PRESS_DOWN) {
            this.body.setVelocityY(this.velocity);
            this.currentDirection = direction.DOWN; 
            this.weapon.setPosition(...weaponPosition.DOWN)
        }

        // ATTACKING

        if (key.PRESS_ATTACK && !this.playerAttacking) {
            this.weapon.alpha = 1;
            this.playerAttacking = true;
            this.attackAudio.play();

            this.scene.time.delayedCall(150, () => {
                this.weapon.alpha = 0;
                this.playerAttacking = false;
                this.swordHit = false;
            }, [], this)
        }



        // TODO: Fix this
        if (this.playerAttacking) {

            // Attack animation
            this.weapon.angle = (this.weapon.flipX) ? (this.weapon.angle - 10) : (this.weapon.angle + 10)

        } else {
            // X direction - moving with the weapon
            if (this.currentDirection === direction.DOWN) {
                this.weapon.setAngle(-270);
            } else if (this.currentDirection === direction.UP) {
                this.weapon.setAngle(-90);
            } else {
                this.weapon.setAngle(0)
            }

            // Y direction - flipping the weapon
            this.weapon.flipX = false; 
            if (this.currentDirection === direction.LEFT) {
                this.weapon.flipX = true;
            }


        }


        this.updateHealthBar();  // update player’s health bar
    }

    // health bar
    createhealthBar() {
        this.healthBar = this.scene.add.graphics();
        this.updateHealthBar();

    }

    updateHealthBar() {
        this.healthBar.clear();

        // this is the white part behind the healthbar
        // TODO: Make player Healthbar on HUD
        this.healthBar.fillStyle(0xffffff, 1);
        this.healthBar.fillRect(this.x - 32, this.y - 40, 64, 5);

        // this is the health itself
        this.healthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
        this.healthBar.fillRect(this.x - 32, this.y - 40, 64 * (this.health / this.maxHealth), 5)

    }

    updateHealth(health) {
        this.health = health; 
        this.updateHealthBar();
    }

    respawn(playerObject) {
        this.health = playerObject.health; 
        this.setPosition(playerObject.x, playerObject.y);
        this.updateHealthBar();
    }


}
