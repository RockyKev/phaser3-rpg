# Phaser 3 RPG


## Structure
- resources folder - placeholder for storing data
- src folder - where the real stuff lives. Should compile to a `dist/` folder.
 

It has been updated to use ES modules. 

## Tasks:

[x] - update and handle all the TODOS
[x] - change image to Link and walk
[x] - change map to temporary Zelda
[x] - scale the map closer. Make it 50% bigger.
[x] - properly use ES Modules and remove all the extra script calls. 
[x] - locationOfPlayer -> locationOfPlayer (and all the others)
[x] - sfxGoldPickup -> to sfxGoldPickup (FUTURE: group them)
[x] - rename gameManager->sceneMonsters to InstancesOfMonsters
[x] - rename chestGroup, monsterGroup -> physicsGroupChests, physicsGroupMonsters
[x] - clean up gameScene's event listeners

### Enemies are working (MON/TUES)
[x] - add enemies from Zelda as sprites. 
[x] - Enemies should be showing on the map.
[x] - Enemies should be diverse.
[] - Enemies should have movement behavior.
[] - Enemies should have alert behaviors.
[] - Enemies have attack behaviors. (projectile, move erratically, chase)
[] - Enemies have different HP 
[] - Enemies collide should hurt.
[] - Enemies when attacked should have invincible state.
[] - Enemies should only trigger when you're near them. have enemies not move/interact unless they're in view.
[] - Enemies have movement graphics. enemy animations work correctly based on movement position.
[] - enemies 'poof' when they die. 
[] - Enemies drop hearts, rupees, bombs, or arrows. 

### Debug features (MON)
[x] - Have a camera unlock button.
[x] - Have a 'console.log this' button.
[] - Create a battle room. Switches release enemies.
[] - Create a debug room. Contains each of the event triggers. 
[x] - Have a full-health button/1000 rupees button.

### Scene Transitions (WEDS)
[x] - add event transitions. When you walk on a door, it takes you somewhere.
[] - Door transitions. So screen does a Bond effect zooming in and out.
[] - When you walk on certain spots, there's text that tells you the territory.
[] - There's a signpost with a dialog box.
[] - Walking into the cave is the old man scenario.
[] - Walking to the dungeon shows another cave.

### UI Updates (THURS)
[] - replace life with hearts.
[] - Replace coins with rupees.
[] - create a 'options' page that pauses the game.
[] - There's a inventory menu now, where you can select between bombs, or arrows. That's mapped to a different key.
[] - You can buy something from the other cave - which properly deducts rupees.
[] - There's a title screen.

### Item updates (FRI)
[] - you can pick up hearts.
[] - you can fire arrows.
[] - you can use bombs. 
[] - There's a spot where you can pick up rupees.
[] - There's a spot where you can pick up health.

### Link Updates (SAT)
[] - Link properly attacks
[] - Shield properly deflects. 
[] - Link gains invincibility flashing when hit.
[] - When link dies, screen fades to black and returns to title screen.

### Game Functions and Added stuff
[] - add music
[] - add sound effects when attacking
[] - add camera blur to edges like in Links Awakening. https://www.youtube.com/watch?v=fxb4VFDgPGY
[] - add water animation
[] - make run button
[] - transition levels
[] - save state
[] - The game auto-saves during cave transitions. It saves all the flags of the character.
### Follow-up bugs
[] - BUG: I don't think this many monsters are supposed to be generated. Currently generating 4 monsters per spawn. 
[] - WAIT ON THIS: rename ID to instance ID 
[] - BUG: you can't pick up new items that are generated. (pick up chest, then pick it up again and it will fail.)
[] - move triggerEvents to the GameManager
[] - Run through all TODO items again.

[x] - update phaser

## Random Information

### How does Tiled work

The Rogue-like version:
Tiled and the `resources/assets/level/large_level.tmx` file.

It's broken into five layers.

* player_locations
* monster_locations
* chest_locations
* blocked
* bottom

monster_locations - How this works:

* It's a single tile graphic, that gets replaced.
* There's a custom property `spawner: 1`. (Well, 1 to 6)
* In the GameManager->parseMapData(): It groups all the spawners together. So 6 groups of spawners, that contain `x` `y` data. And it randomly selects which one to generate a monster to.





### Monster Groups
> A benefit of having the monsters in a group is, you will be able to use this runChildUpdate property that Phaser has. This property is set to false by default. However, if there is an update method defined on that class, Phaser will automatically run that method for you if you set runChildUpdate property to true.

```
// in GameScene.js
this.monsters.runChildUpdate = true;


// in Monster.js 
update() {
    //...
}
```

### Using the cursor to switch between animations
This is probably the best example of it live:
https://labs.phaser.io/edit.html?src=src/tilemap/switching%20tilesets.js

1. import the spritesheet

```js
    this.load.spritesheet('player', 'assets/sprites/spaceman.png', { frameWidth: 16, frameHeight: 16 });

    // Note: If you're using an atlas, it's a bit different.
    this.load.atlas('link', 'src/images/link-sheet.png', 'src/images/link-sheet.json');
```

2. Make sure you're using a type sprite, and not a image.

Image doesn't have the animation manager. Makes them lighter.

3. create the animation
```js
// for generic sprites
this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 9 }),
    frameRate: 10,
    repeat: -1
});

// For atlas
this.anims.create({
    key: 'walkSide',
    frames: this.anims.generateFrameNames('link', {
        suffix: '.png',
        start: 18,
        end: 24,
    }),
    frameRate: 7,
    repeat: -1,
});
```

4. Tie the movement to the animation

In the example below, the player is `this.player`,  which is managing it's animation.

```js
if (key.PRESS_LEFT) {
        this.player.flipX = false;
        this.player.anims.play('walkSide', true);
    } else if (key.PRESS_RIGHT) {
        this.player.flipX = true;
        this.player.anims.play('walkSide', true);
    } else if (key.PRESS_UP) {
        this.player.anims.play('walkUp', true);
    } else if (key.PRESS_DOWN) {
        this.player.anims.play('walkDown', true);
    } else {
        this.player.anims.stop();

        // return to first frame
        if (this.player.anims.currentAnim) {
            this.player.anims.setCurrentFrame(this.player.anims.currentAnim.frames[0]);            
        }

    }

```


### Tiled Layers: Layers Vs Objects

So in Tiled, there are: 
* layers - which are graphics.
* objects - which are representatives of the respective object.

Tiled does not save the 'tile' graphic. It only gives you the x,y value.

When you pull it into the game - it's just data. 
So you'll need to filter it yourself, then attach a graphic to it.

For example:

1. We import the JSON. The chest is on a `chest_locations` layer. 
2. We also import a spritesheet called `itemsSpriteSheet`.
3. We do filtering of that JSON to figure out where it goes.
4. We then bring it into the game via the `chest.js` class, that is generated in the GameScene.

```js
chest = new Chest({
        scene: this,
        x: location[0],
        y: location[1],
        key: 'itemsSpriteSheet',
        frame: 0,
        coins: chestObject.gold,
        id: chestObject.id,
    });
```



### How to generate tile sets.

This is so freakin' convoluted. WTF.

Okay so:
1. Get a tileset. Make sure it's like 24x24, 32x32, 64x64.... whatever it is it's even. 
Use Photoshop or Photopea and turn on grids.
Save that as a PNG or something with a transparent color.

2. Use something like Tiled and import that PNG.
Set the tile size to match whatever that tileset size is.

Build the map.
The generic pattern is: 
A bottom layer (this is the floor)
A blocked layer (anything that physically stops movement)

Then object layers. (Player, monsters, chests...)

The bottom/blocked layers have collision on them within Phaser.



3. Now, export that jawn.

So you'll get this nice json file.

Inside is a `name` attribute. 
It should be the same name as the file you import as a image.

In the json:
`"name":"tilesetPNG",`

In the bootScene.js
`this.load.image('tilesetPNG', 'src/levels/bs-zelda-extruded.png');`

4. Here's where it gets crazy.
So there's some weird stuff with tiles. Things don't line up?
Instead, use `https://github.com/sporadic-labs/tile-extruder` to extrude your 32x32 or whatever size.
If we're doing 32x32, the end result is to something like 34x34.


4. Now import that extruded file as the image. Now shit just works?


### Image Origins
https://phasergames.com/how-to-set-an-image-anchor-point-of-origin-in-phaser-3/
![](https://i.imgur.com/G4evbvz.png)

### Extrude your graphics
https://github.com/sporadic-labs/tile-extruder
SO the default graphics is 32x32. But then it gets extruded to 34x34.
Then, like the readme of this package:
```js
this.tiles = this.map.addTilesetImage( this.tileSetName,  this.tileSetName, 32, 32, 1, 2);
```

### How does chests work from start to finish?
Note: This is when chests would randomly generate.

**CREATING IT:**
1. The chest is generated by the JSON data, on the `chest_locations` layer. 
2. In `GameManager.js->setupSpawners()`, we pour through the the data points and then randomly pick one of the many locations. (as seen in `Spawner.js->spawnChest()`)
3. Once it's picked, it adds the data to GameManager->InstancesOfChests[chestId]. Then we are actually sending over a callback function from GameManager called `addChest()`. 
4. `AddChest()` sends an event to `GameScene.js` called "chestSpawned", which just calls the `GameScene.js->spawnChest()` method.

Let's stop there for a moment. Why the hell are we passing things over the fence multiple times? Why not just go
spawner.js -> GameScene.js? 

a. `Spawner.js` job is just a helper. It's job is to just to properly create objects.
b. `GameManager.js` job is to store the data of various interactable elements within the game. It's managing the data side.
c. `GameScene.js` job is control. It shows things, hides things, destroys and creates thing. If `GameManager.js` says there's a new enemy, then it'll tell `GameScene.js` to create it based on the data.

Back to the sequence of events. 

5. In the `GameScene.js->spawnChest()` method, we are checking if a chest within that id-type exists. If it doesn't, create it. If it does, reuse a old one. This is more of a performance thing.


**COLLISION:**

6. So now that it's in the game, let's move on to when the player touches the chest. We'll set up a `GameScene.js->addCollisions()` that manages that. If player collides with the chestGroup, then fire off this callback function `collectChest()`

7. `GameScene.js->collectChest()` will play the audiopickup noise, then emit an event 'pickUpChest', which is picked up by the GameManager.js.

8. In the GameManager.js, it fires off a event back to `GameScene.js` to remove the chest. It'll also fire a event to the `UIScene.js` to update the UIGold.

We're starting to see that with emitting events, we can pass data between a bunch of files.

9. Back in the GameScene.js. It is now looking through the chestGroup to properly disable it.  

The layout of data is: 
```
gameManager 
    * InstancesOfChests
        * chest-1
        * chest-2
        * chest-3
```
chest-1 contains a chest-1, which has a bunch of different random x,y values to choose from and a unique Id.

Questions: How to make more chests per scene?
Create more spawn IDs. 

Right now, there's 3 spawn IDs (chest-1, chest-2, chest-3). So more make.




## Key terms

**Collider**
`this.physics.add.collider({options})`

When 2 elements' points hit each other.

**Overlapping**
`this.physics.add.overlap({options});`

When 2 elements points overlap. 


Atlas
Asset Pack
Scene
Animation
Tilemap 
Container (in Phaser terms)

**Sprite Animation**

It's when you use a sprite sheet, and break them into a specific tile height/width that turns them into frames.
Then run the frames.

A code example: https://labs.phaser.io/edit.html?src=src/animation/chained%20animation.js


https://www.thepolyglotdeveloper.com/2020/07/animate-spritesheets-phaser-game/

**setPosition() vs this.physics.moveToObject()**
In addition to using setPosition(), we can use this.physics.moveToObject() to move game objects.
While setPosition() will move a game object to the provided position, Phaser will use physics to move the game object to the provided position when you use this.physics.moveToObject().

**Class->Model->Spawner pattern**

The class defines the basic attributes of the element. It's the blueprint.

> An enemy Class should contain just the basic stats, and shared functions.

Where a Model is is more specific, controlling the instance of that class. 

> An enemy Instance has functions that control it's attack patterns, movement, and actual health.

To add enemies to the enemy army, you would create a Model of it.
It should try to handle anything that the gameScene is doing for that model. 

Finally, the spawner is just a mechanism to control it's spawn behavior. It also controls callbacks for what happens after certain behaviors. Like when it's created and when it's destroyed.

**Container VS direct image**
The reason for that is, you are going to switch your player from an arcade image to a container. A container is preferred because now your player objects will be made of two separate sprites. The first will be the player itself, and the second will be the weapon. Instead of having to keep track of these separately, you can easily put them in the container and have that be your player. That way, you can reference both of those game objects relatively easily.

## Related Repos

Side-scroller: https://github.com/RockyKev/phaser3-platformer


## Random links

### Phaser Labs
https://labs.phaser.io/index.html?dir=animation/&q=
This is where the magic is

The example repo is here: https://github.com/photonstorm/phaser3-examples/tree/master/public/assets


### TOOL: Tiled
Use Tiled -- https://www.mapeditor.org/
https://medium.com/swlh/grid-based-movement-in-a-top-down-2d-rpg-with-phaser-3-e3a3486eb2fd
Tiled > New Map > Tile Render order - Right down
![](https://i.imgur.com/RT6MLZE.png)

Layer types:
    * Tile layer - just graphics
    * Tile Layer - Blocked (to symbolize layers that stop the user)
    * Object layer - Spawn points for chests, monsters, entery exit. (How to use ![](https://i.imgur.com/MttKym6.png))
        * You can add custom properties.

Export as a JSON.

How to use Tiled

### TOOL: Atlas Packer and Animator tool
https://gammafp.com/tools/

### TOOL: Texture Packer
http://free-tex-packer.com/
https://free-tex-packer.com/app/
Creates tiles/textures

### Phaser Editor 2D
Phaser Editor: https://phasereditor2d.itch.io/ide


### Tutorials to check check check it out
https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6

How to have enemy move towards you
https://stackoverflow.com/questions/67708864/how-do-i-make-it-so-an-enemy-sprite-follows-the-player-sprite-in-phaser-3

### Random websites
https://phasergames.com/phaser-3-snippets/
https://rexrainbow.github.io/phaser3-rex-notes/docs/site/


