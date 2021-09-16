export function randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}


// enums
export const SpawnerType = Object.freeze({
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
});


// Unused
function pickRandomLocation() {
        // TODO: This code smells
        const location =
            this.spawnLocations[
                Math.floor(Math.random() * this.spawnLocations.length)
            ];

        const invalidLocation = this.objectsCreated.some((obj) => {
            if (obj.x === location[0] && obj.y === location[1]) {
                return true;
            }

            return false;
        });

     // recursion
     if (invalidLocation) return this.pickRandomLocation();

        return location;
}

// Warps have a eventType, eventAction, eventValue 
// This allows us to change warps on the fly without having to modify the TILED json. 
// const [x, y] = EventWarps[eventAction][eventValue];
// const [x, y] = EventWarps['goto']['old_mans_cave'];

export const EventWarps = {
    'goto': {
        'old_mans_cave': [1000, 1000],
        'monsters_cave': [1500, 1500], 
        'dungeon': [2390, 2500]
    },
    'changeScene': {

    }
}



// In Tiled, the location of an object refers to the location of its bottom left corner.
// In Phaser 3, the default anchor point is the middle of the object.
// This corrects it.

// export function getAnchorPoints(object) {

//     const [x, y] = [object.x, object.y];
//     const [width, height] = [object.width, object.height];

//     let anchorPoints = {}; 

//     anchorPoints['x'] = x + (width / 2);
//     anchorPoints['y'] = y + (height / 2);

//     return anchorPoints;
// }