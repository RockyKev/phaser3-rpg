import { Player } from "./Player.js";

// export class PlayerContainer extends Phaser.Physics.Arcade.Image {
export class PlayerContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, frame) {

      super(scene, x, y);
      this.scene = scene; // the scene this container will be added to
      // this.velocity = 160; // the velocity when moving our player
      this.velocity = 400; // the velocity when moving our player

        // set the size of our container
        this.setSize(64, 64);

      // enable physics
      this.scene.physics.world.enable(this);

      // collide with world bounds
      this.body.setCollideWorldBounds(true);

      // add the player to our existing scene       // have the camera follow the player
       this.scene.add.existing(this);
       this.scene.cameras.main.startFollow(this);   


       console.log("player Container")
       // create the player
       this.player = new Player(this.scene, 0, 0, key, frame);
       this.add(this.player);
    }
  
    update(cursors) {
      this.body.setVelocity(0);
  
      const key = {
        pressLeft : cursors.left.isDown,
        pressRight : cursors.right.isDown,
        pressUp: cursors.up.isDown,
        pressDown: cursors.down.isDown
      }
  
  
  
      if (key['pressLeft']) {
        this.body.setVelocityX(-this.velocity);
      } else if (key['pressRight']) {
        this.body.setVelocityX(this.velocity);
      }
  
      if (key['pressUp']) {
        this.body.setVelocityY(-this.velocity);
      } else if (key['pressDown']) {
        this.body.setVelocityY(this.velocity);
      }
    }
  }
  