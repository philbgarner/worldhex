import { GenerateCellsVoronoi } from "./map";
import { randInt } from "./random";

let width = 256
let height = 256

const map = GenerateCellsVoronoi(width, height, [
    { id: 0, x: 0, y: 0 },
    { id: 1, x: 255, y: 0 },
    { id: 2, x: 255, y: 255 },
    { id: 3, x: 0, y: 255 },

    { id: 4, x: randInt(64, 128), y: 64 },
    { id: 5, x: randInt(196, 255), y: 64 },
    { id: 4, x: randInt(64, 128), y: 196 },
    { id: 5, x: randInt(196, 255), y: 196 }
], ['grasslands', 'mountains', 'woodlands'], [
    { name: 'grass', group: 'grasslands', bgColor: '', colors: ['green'], blockMovement: false, blockVision: false, characters: ['.', ','] },
    { name: 'woods', group: 'woodlands', bgColor: '', colors: ['green'], blockMovement: false, blockVision: false, characters: ['$', '!', '"'] },
    { name: 'mountain', group: 'mountains', bgColor: '', colors: ['grey'], blockMovement: false, blockVision: false, characters: ['^'] },
])

export default map