import * as map from "./map";
import * as random from "./random";

let width = 256
let height = 256

export default {
    ...map,
    ...random,
    width, height
}