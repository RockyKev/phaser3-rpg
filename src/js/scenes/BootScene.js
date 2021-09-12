export class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {

        this.loadImages();

        this.loadSpriteSheets();

        this.loadAudio();

        this.loadTileMap();
    }

    loadImages() {
        this.load.image('button1', 'src/images/ui/blue_button01.png');
        this.load.image('button2', 'src/images/ui/blue_button02.png');

        // load the map tileset image
        // this.load.image('tilesetPNG', 'src/levels/background-extruded.png');
        this.load.image('tilesetPNG', 'src/levels/bs-zelda-extruded.png');
    }

    loadSpriteSheets() {
        this.load.spritesheet('itemsSpriteSheet', 'src/images/items.png', {
            frameWidth: 32,
            frameHeight: 32,
        });
        this.load.spritesheet('characters', 'src/images/characters.png', {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.atlas('link', 'src/images/link-sheet.png', 'src/images/link-sheet.json');

        this.load.spritesheet('monsterSpritesheet', 'src/images/monsters.png', {
            frameWidth: 32,
            frameHeight: 32,
        });


    }

    loadAudio() {
        this.load.audio('goldSound', ['src/audio/Pickup.wav']);
        this.load.audio('enemyDeath', ['src/audio/EnemyDeath.wav']);
        this.load.audio('playerAttack', ['src/audio/PlayerAttack.wav']);
        this.load.audio('playerDamage', ['src/audio/PlayerDamage.wav']);
        this.load.audio('playerDeath', ['src/audio/PlayerDeath.wav']);
    }

    loadTileMap() {
        // this.load.tilemapTiledJSON(
        //     'tilesetJSON',
        //     'src/levels/large_level2.json'
        // );


        this.load.tilemapTiledJSON(
            'tilesetJSON',
            'src/levels/zelda_test2.json'
        );
    }

    create() {
        //  this.scene.start('Title');
        
        this.scene.start('Game');
    }
}
