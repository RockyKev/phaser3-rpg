# Phaser 3 RPG

## Related Repos

Side-scroller: https://github.com/RockyKev/phaser3-platformer


## Structure
- resources folder - placeholder for storing data
- src folder - where the real stuff lives. Should compile to a `dist/` folder.
 

It has been updated to use ES modules. 

## Tasks:

[x] - update and handle all the TODOS
[x] - change image to Link and walk
[] - change map to temporary Zelda
[] - properly use ES Modules and remove all the extra script calls. 

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





### Lesson 30
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

