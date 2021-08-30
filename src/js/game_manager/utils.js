export function randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}


// enums
export const SpawnerType = {
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
};


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