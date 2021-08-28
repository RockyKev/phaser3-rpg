import { Player } from './Player.js';

const direction = {
    RIGHT: 'RIGHT', 
    LEFT: 'LEFT', 
    UP: 'UP', 
    DOWN: 'DOWN'
}

// export class PlayerContainer extends Phaser.Physics.Arcade.Image {
export class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame) {
        super(scene, x, y);
        this.scene = scene; // the scene this container will be added to
        this.velocity = 400; // DEFAULT was 160 -- the velocity when moving our player
        this.currentDirection = direction.RIGHT;
        this.playerAttacking = false;
        this.flipX = true; 
        this.swordHit = false;

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
    }

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

        } else if (key.PRESS_RIGHT) {
            this.body.setVelocityX(this.velocity);
            this.currentDirection = direction.RIGHT; 
            this.weapon.setPosition(...weaponPosition.RIGHT)
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
            this.scene.time.delayedCall(150, () => {
                this.weapon.alpha = 0;
                this.playerAttacking = false;
                this.swordHit = false;
            }, [], this)
        }



        // TODO: Fix this
        if (this.playerAttacking) {

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

    }
}