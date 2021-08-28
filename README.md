# Phaser 3 RPG


## My notes about Phaser RPG.


## Related Repos

Side-scroller: https://github.com/RockyKev/phaser3-platformer


## Structure
- resources folder - placeholder for storing data
- src folder - where the real stuff lives. Should compile to a `dist/` folder.
 

It has been updated to use ES modules. 


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

**Container VS direct image**
The reason for that is, you are going to switch your player from an arcade image to a container. A container is preferred because now your player objects will be made of two separate sprites. The first will be the player itself, and the second will be the weapon. Instead of having to keep track of these separately, you can easily put them in the container and have that be your player. That way, you can reference both of those game objects relatively easily.

## Random links
Phaser Editor: https://phasereditor2d.itch.io/ide