export class GameManager {
    constructor(scene, MapData) {
        this.scene = scene;
        this.MapData = MapData;

        this.spawners = {};
        this.chests = {};

        this.playerLocations = [];
        this.chestLocations = {};
        this.monsterLocations = {};
    }

    setup() {
        this.parseMapData();
        this.setupEventListener();
        this.setupSpawners();
        this.spawnPlayer();
    }

    parseMapData() {
        // The parseMapData method will be used to parse the layer data that was exported from Tiled, which will be used to generate the three locations.

        // console.log(this.MapData); Will show all the objects made in Tiled.

        for (let layer of this.MapData) {


            // TODO: Refactor the if/else out
            // const layerType = ['player_locations', 'chest_locations', 'monster_locations'];
            if (layer.name === 'player_locations') {

                layer.objects.forEach( obj => this.playerLocations.push([obj.x, obj.y]) )

            } else if (layer.name === 'chest_locations') {

                // TODO: Maybe MAP?
                layer.objects.forEach( obj => {
                    const spawnProps = obj.properties.spawner;
  
                    if (this.chestLocations[spawnProps]) {
                        this.chestLocations[spawnProps].push([obj.x, obj.y]);
                    } else {
                        this.chestLocations[spawnProps] = [[obj.x, obj.y]]
                    }
                })

            } else if (layer.name === 'monster_locations') {

                layer.objects.forEach( obj => {
                    const spawnProps = obj.properties.spawner;
  
                    if (this.monsterLocations[spawnProps]) {
                        this.monsterLocations[spawnProps].push([obj.x, obj.y]);
                    } else {
                        this.monsterLocations[spawnProps] = [[obj.x, obj.y]]
                    }
                })


            }

        }

        console.log("player", this.playerLocations);
        console.log("mon", this.monsterLocations);
        console.log("chest", this.chestLocations);
    }

    setupEventListener() {
        // The setupEventListener method will be used to create any event listeners that will need to be hooked up to the GameManager object, such as when a player picks up a chest. 


    }

    setupSpawners() {

    }

    spawnPlayer() {
        console.log("spawn player starting")
        const location = this.playerLocations[Math.floor(Math.random() * this.playerLocations.length)];
        this.scene.events.emit('spawnPlayer', location);

    }


}