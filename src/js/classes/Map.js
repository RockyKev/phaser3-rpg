
export class Map {
    constructor(scene, tileMapkey, tileSetName, bottomLayerName, blockedLayerName) {

        // this.map = new Map(this, 'tilesetJSON', 'tilesetPNG', 'bottom', 'blocked');
        this.tileMapkey = 'tilesetJSON' || tileMapkey;
        this.tileSetName = tileSetName; 
        this.bottomLayerName = bottomLayerName;
        this.blockedLayerName = blockedLayerName; 
        this.scene = scene; 
        this.createMap();
    }


    // createMapOrig() {
    //         // 32 x 32. 
    // const mapScale = 2;

    // // create the tile map add the tileset image to our map
    // this.map = this.scene.make.tilemap({ key: 'tilesetJSON' });

    // // The first param is the json->tilesets.name 
    // this.tiles = this.map.addTilesetImage('tilesetPNG', 'tilesetPNG', 32, 32, 1, 2);

    // // create our background (layer name within JSON)
    // this.bottomLayer = this.map.createLayer('bottom', this.tiles, 0, 0);
    // this.bottomLayer.setScale(mapScale);
    // this.blockedLayer = this.map.createLayer('blocked', this.tiles, 0, 0);
    // this.blockedLayer.setScale(mapScale);

    // // This method, setCollisionByExclusion, takes in an array to determine which tiles should be excluded from being checked. Using an array value of [-1] means that all of the tiles in the layer will be checked for collisions. 
    // this.blockedLayer.setCollisionByExclusion([-1]);

    // // make the world the size of our map element. Then force the camera edge.
    // this.scene.physics.world.bounds.width = this.map.widthInPixels * mapScale;
    // this.scene.physics.world.bounds.height = this.map.heightInPixels * mapScale;
    // this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * mapScale, this.map.heightInPixels * mapScale)
    // }

    createMap() {
            // 32 x 32. 
        const mapScale = 2;

        // create the tile map add the tileset image to our map
        this.map = this.scene.make.tilemap({ key: this.tileMapkey });

        // The first param is the json->tilesets.name 
        this.tiles = this.map.addTilesetImage( this.tileSetName,  this.tileSetName, 32, 32, 1, 2);
        // this.tiles = this.map.addTilesetImage('tilesetPNG', 'tilesetPNG', 32, 32, 1, 2);
        
        // create our background (layer name within JSON)
        this.bottomLayer = this.map.createLayer(this.bottomLayerName, this.tiles, 0, 0);
        this.bottomLayer.setScale(mapScale);
        this.blockedLayer = this.map.createLayer(this.blockedLayerName, this.tiles, 0, 0);
        this.blockedLayer.setScale(mapScale);


        // This method, setCollisionByExclusion, takes in an array to determine which tiles should be excluded from being checked. Using an array value of [-1] means that all of the tiles in the layer will be checked for collisions. 
        this.blockedLayer.setCollisionByExclusion([-1]);

        // make the world the size of our map element. Then force the camera edge.
        this.scene.physics.world.bounds.width = this.map.widthInPixels * mapScale;
        this.scene.physics.world.bounds.height = this.map.heightInPixels * mapScale;
        this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * mapScale, this.map.heightInPixels * mapScale)
    }

}