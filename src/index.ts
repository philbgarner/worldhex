export * as hexmap from "./map";
export * as random from "./random";

import { clearMap, Coordinates, Rect } from './map'

let width = 256
let height = 256
clearMap()

export {
    Coordinates, Rect,
    width, height
}