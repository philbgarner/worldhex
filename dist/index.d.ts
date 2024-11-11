/**
 * X and Y coordinates.
 */
type Coordinates = {
    x: number;
    y: number;
};
/**
 * A rectangle.
 */
declare class Rect {
    x: number;
    y: number;
    w: number;
    h: number;
    constructor(x: number, y: number, w: number, h: number);
}
declare let width$1: number;
declare let height$1: number;
declare let mapCells: MapCell[][];
declare let exploredCells: boolean[][];
declare let exploredCellCache: MapCell[];
declare let voronoiCells: VoronoiCell[][];
declare let edges: EdgeCoordinate[];
declare let corners: EdgeCoordinate[];
declare let middles: VoronoiCoordinate[];
declare let voronoiRegions: VoronoiRegion[];
type VoronoiCoordinate = {
    id: number;
    x: number;
    y: number;
};
type EdgeCoordinate = {
    id: number;
    x: number;
    y: number;
    neighbouringRegions: number[];
};
type VoronoiRegion = {
    id: number;
    coords: VoronoiCoordinate;
    edges: EdgeCoordinate[];
    corners: EdgeCoordinate[];
    neighbours: number[];
    middles: VoronoiCoordinate[];
};
type VoronoiCell = {
    voronoiId: number;
    distance: number;
};
type CellType = {
    name: string;
    group: string;
    colors: string[];
    bgColor: string;
    characters: string[];
    blockVision: boolean;
    blockMovement: boolean;
};
type MapCell = {
    cellType: CellType;
    light: number;
    x: number;
    y: number;
};
type WorldMap = {
    mapCells: MapCell[][];
    voronoiCells: VoronoiCell[][];
    voronoiRegions: VoronoiRegion[];
    exploredCells: boolean[][];
};
interface GenerateCellFunction {
    (cellTypes: CellType[], x: number, y: number): CellType;
}
declare let generateCellFunction: GenerateCellFunction;
declare function setGenerateCellFunction(generateFn: GenerateCellFunction): void;
declare function GenerateCell(cellTypes: CellType[], x: number, y: number): CellType;
interface SelectCellTypesFunction {
    (x: number, y: number): CellType[];
}
/**
 * Default function for selecting the palette of cell types to pass to the generator.
 * @param x
 * @param y
 * @returns
 */
declare let selectCellTypes: SelectCellTypesFunction;
declare function distance(x1: number, y1: number, x2: number, y2: number): number;
declare function getVCell(x: number, y: number): VoronoiCell | null;
/**
 * Calculate voronoi regions and populate the map based on the locations of region cells.
 * @param voronoiPointCoords Array of centre-points for each region to calculate.
 * @param voronoiGroups Group filter(s) to use from cell types palette for each region.
 * @param voronoiCellTypes Palette of cell types to use in the generator. Group property allows selecting certain cell types based on voronoi region.
 */
declare function GenerateCellsVoronoi(width: number, height: number, voronoiPointCoords: VoronoiCoordinate[], voronoiGroups: string[], voronoiCellTypes: CellType[]): null | WorldMap;
declare function getRegion(id: number): null | VoronoiRegion;
declare function clearMap(): void;
declare function SelectCellTypes(x: number, y: number, selectFn?: SelectCellTypesFunction): CellType[];
declare function Initialize(mapWidth: number, mapHeight: number, selectCellTypesFunction?: SelectCellTypesFunction): void;
interface GetCellsFilterFunction {
    (cell: CellType): boolean;
}
declare function getCells(filterFn: GetCellsFilterFunction): MapCell[];
declare function getCell(x: number, y: number): null | MapCell;
declare function setCell(mapCell: MapCell): void;
declare function setExplored(x: number, y: number): void;
declare function setAllExplored(): void;
declare function isExplored(x: number, y: number): boolean;
declare function getExploredCells(): MapCell[];
declare function fov(viewRadius: number, x: number, y: number): MapCell[];

type map_CellType = CellType;
type map_Coordinates = Coordinates;
type map_EdgeCoordinate = EdgeCoordinate;
declare const map_GenerateCell: typeof GenerateCell;
type map_GenerateCellFunction = GenerateCellFunction;
declare const map_GenerateCellsVoronoi: typeof GenerateCellsVoronoi;
type map_GetCellsFilterFunction = GetCellsFilterFunction;
declare const map_Initialize: typeof Initialize;
type map_MapCell = MapCell;
type map_Rect = Rect;
declare const map_Rect: typeof Rect;
declare const map_SelectCellTypes: typeof SelectCellTypes;
type map_SelectCellTypesFunction = SelectCellTypesFunction;
type map_VoronoiCell = VoronoiCell;
type map_VoronoiCoordinate = VoronoiCoordinate;
type map_VoronoiRegion = VoronoiRegion;
type map_WorldMap = WorldMap;
declare const map_clearMap: typeof clearMap;
declare const map_corners: typeof corners;
declare const map_distance: typeof distance;
declare const map_edges: typeof edges;
declare const map_exploredCellCache: typeof exploredCellCache;
declare const map_exploredCells: typeof exploredCells;
declare const map_fov: typeof fov;
declare const map_generateCellFunction: typeof generateCellFunction;
declare const map_getCell: typeof getCell;
declare const map_getCells: typeof getCells;
declare const map_getExploredCells: typeof getExploredCells;
declare const map_getRegion: typeof getRegion;
declare const map_getVCell: typeof getVCell;
declare const map_isExplored: typeof isExplored;
declare const map_mapCells: typeof mapCells;
declare const map_middles: typeof middles;
declare const map_selectCellTypes: typeof selectCellTypes;
declare const map_setAllExplored: typeof setAllExplored;
declare const map_setCell: typeof setCell;
declare const map_setExplored: typeof setExplored;
declare const map_setGenerateCellFunction: typeof setGenerateCellFunction;
declare const map_voronoiCells: typeof voronoiCells;
declare const map_voronoiRegions: typeof voronoiRegions;
declare namespace map {
  export { type map_CellType as CellType, type map_Coordinates as Coordinates, type map_EdgeCoordinate as EdgeCoordinate, map_GenerateCell as GenerateCell, type map_GenerateCellFunction as GenerateCellFunction, map_GenerateCellsVoronoi as GenerateCellsVoronoi, type map_GetCellsFilterFunction as GetCellsFilterFunction, map_Initialize as Initialize, type map_MapCell as MapCell, map_Rect as Rect, map_SelectCellTypes as SelectCellTypes, type map_SelectCellTypesFunction as SelectCellTypesFunction, type map_VoronoiCell as VoronoiCell, type map_VoronoiCoordinate as VoronoiCoordinate, type map_VoronoiRegion as VoronoiRegion, type map_WorldMap as WorldMap, map_clearMap as clearMap, map_corners as corners, map_distance as distance, map_edges as edges, map_exploredCellCache as exploredCellCache, map_exploredCells as exploredCells, map_fov as fov, map_generateCellFunction as generateCellFunction, map_getCell as getCell, map_getCells as getCells, map_getExploredCells as getExploredCells, map_getRegion as getRegion, map_getVCell as getVCell, height$1 as height, map_isExplored as isExplored, map_mapCells as mapCells, map_middles as middles, map_selectCellTypes as selectCellTypes, map_setAllExplored as setAllExplored, map_setCell as setCell, map_setExplored as setExplored, map_setGenerateCellFunction as setGenerateCellFunction, map_voronoiCells as voronoiCells, map_voronoiRegions as voronoiRegions, width$1 as width };
}

interface RandomFloatFunction {
    (min: number, max: number): number;
}
declare function useRandomFloatFn(randomFn: RandomFloatFunction): void;
declare function randInt(min: number, max: number): number;
declare function rand(min: number, max: number): number;

type random_RandomFloatFunction = RandomFloatFunction;
declare const random_rand: typeof rand;
declare const random_randInt: typeof randInt;
declare const random_useRandomFloatFn: typeof useRandomFloatFn;
declare namespace random {
  export { type random_RandomFloatFunction as RandomFloatFunction, random_rand as rand, random_randInt as randInt, random_useRandomFloatFn as useRandomFloatFn };
}

declare let width: number;
declare let height: number;

export { height, map, random, width };
