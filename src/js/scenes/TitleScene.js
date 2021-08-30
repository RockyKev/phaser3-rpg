import { UIButton } from '../classes/UIButton.js';
export class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    create() {
        // create title text
        this.titleText = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            'Zenva MMORPG',
            { fontSize: '64px', fill: '#fff' }
        );
        this.titleText.setOrigin(0.5);

        this.startGameButton = new UIButton({
            scene: this,
            x: this.scale.width / 2,
            y: this.scale.height * 0.65,
            key: 'button1',
            hoverKey: 'button2',
            text: 'Start!',
            targetCallback: this.startScene.bind(this, 'Game'),
        });
    }

    startScene(targetScene) {
        this.scene.start(targetScene);
    }
}
