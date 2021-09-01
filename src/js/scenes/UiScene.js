export class UIScene extends Phaser.Scene {
  constructor() {
    super('Ui');
  }

  init() {
    this.gameScene = this.scene.get('Game');
  }

  create() {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements() {
    // create the score text game object and coin icon
    this.scoreText = this.add.text(36, 8, 'Coins: 0', { fontSize: '16px', fill: '#fff' });
    this.coinIcon = this.add.image(15, 15, 'items', 3);

    this.playerHealthBar = this.add.graphics();
  }

  setupEvents() {
    // listen for the updateUIGold event from the game scene
    this.gameScene.events.on('updateUIGold', (score) => {
      this.scoreText.setText(`Coins: ${score}`);
    });

    // listen for the updateHealth event from the game scene
    this.gameScene.events.on('updateUIHealth', (player) => {

      let hb = {
        width: 64 * 4,
        height: 12,
        x: 140,
        y: 10
    }

      this.playerHealthBar.clear();
      this.playerHealthBar.fillStyle(0xffffff, 1);
      this.playerHealthBar.fillRect(hb.x, hb.y, hb.width, hb.height);

      this.playerHealthBar.fillGradientStyle(0xff0000, 0xffffff, 4);
      this.playerHealthBar.fillRect(hb.x, hb.y, hb.width * (player.health / player.maxHealth), hb.height)

    });

  }
}
