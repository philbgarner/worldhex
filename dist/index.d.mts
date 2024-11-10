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
interface GenerateCellFunction {
    (cellTypes: CellType[], x: number, y: number): CellType;
}
interface SelectCellTypesFunction {
    (x: number, y: number): CellType[];
}
interface GetCellsFilterFunction {
    (cell: CellType): boolean;
}

interface RandomFloatFunction {
    (min: number, max: number): number;
}

declare const _default: {
    width: number;
    height: number;
    useRandomFloatFn(randomFn: RandomFloatFunction): void;
    randInt(min: number, max: number): number;
    rand(min: number, max: number): number;
    setGenerateCellFunction(generateFn: GenerateCellFunction): void;
    GenerateCell(cellTypes: CellType[], x: number, y: number): CellType;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    getVCell(x: number, y: number): VoronoiCell | null;
    GenerateCellsVoronoi(width: number, height: number, voronoiPointCoords: VoronoiCoordinate[], voronoiGroups: string[], voronoiCellTypes: CellType[]): void;
    getRegion(id: number): null | VoronoiRegion;
    clearMap(): void;
    SelectCellTypes(x: number, y: number, selectFn?: SelectCellTypesFunction): CellType[];
    Initialize(mapWidth: number, mapHeight: number, selectCellTypesFunction?: SelectCellTypesFunction): void;
    getCells(filterFn: GetCellsFilterFunction): MapCell[];
    getCell(x: number, y: number): null | MapCell;
    setCell(mapCell: MapCell): void;
    setExplored(x: number, y: number): void;
    setAllExplored(): void;
    isExplored(x: number, y: number): boolean;
    getExploredCells(): MapCell[];
    fov(viewRadius: number, x: number, y: number): MapCell[];
    Rect: typeof Rect;
    mapCells: MapCell[][];
    exploredCells: boolean[][];
    exploredCellCache: MapCell[];
    voronoiCells: VoronoiCell[][];
    edges: EdgeCoordinate[];
    corners: EdgeCoordinate[];
    middles: VoronoiCoordinate[];
    voronoiRegions: VoronoiRegion[];
    generateCellFunction: GenerateCellFunction;
    selectCellTypes: SelectCellTypesFunction;
};

export { _default as default };
