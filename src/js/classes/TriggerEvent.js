export class TriggerEvent extends Phaser.Physics.Arcade.Image {
    constructor({scene, x, y, id, key, frame}) {
        super(scene, x, y, key, frame);
        this.scene = scene; 

        // TODO: this should be switched to spawnerId, instanceID, or explain in more details
        this.id = id;
        this.setScale(2).setOrigin(0,1);

        // TODO: What is this it?
        this.scene.add.existing(this);
    }

}
