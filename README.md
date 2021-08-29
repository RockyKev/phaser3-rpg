# Phaser 3 RPG


## My notes about Phaser RPG.


## Related Repos

Side-scroller: https://github.com/RockyKev/phaser3-platformer


## Structure
- resources folder - placeholder for storing data
- src folder - where the real stuff lives. Should compile to a `dist/` folder.
 

It has been updated to use ES modules. 

## Tasks and : 

[] - update and handle all the TODOS
[] - change image to Link.
[] - change map to temporary Zelda
[] - properly use ES Modules and remove all the extra script calls. 

## Lesson notes

### Lesson 1 & 2:
Use Tiled -- https://www.mapeditor.org/

Tiled > New Map > Tile Render order - Right down
![](https://i.imgur.com/RT6MLZE.png)

Layer types:
    * Tile layer - just graphics
    * Tile Layer - Blocked (to symbolize layers that stop the user)
    * Object layer - Spawn points for chests, monsters, entery exit. (How to use ![](https://i.imgur.com/MttKym6.png))
        * You can add custom properties.

Export as a JSON.

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
Phaser Editor: https://phasereditor2d.itch.io/ide