export class Player extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, key, frame) {
    super(scene, x, y, key, frame);
    this.scene = scene; // the scene this container will be added to
    this.velocity = 160; // the velocity when moving our player

    // enable physics
    this.scene.physics.world.enable(this);
    // set immovable if another object collides with our player
    this.setImmovable(false);
    // scale our player
    this.setScale(2);
    // collide with world bounds
    this.setCollideWorldBounds(true);
    // add the player to our existing scene
    this.scene.add.existing(this);
     // have the camera follow the player
     this.scene.cameras.main.startFollow(this);   
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
