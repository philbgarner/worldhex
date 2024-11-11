import { randInt } from './random'

/**
 * X and Y coordinates.
 */
export type Coordinates = {
    x: number,
    y: number
}

/**
 * A rectangle.
 */
export class Rect {
    x: number
    y: number
    w: number
    h: number

    constructor(x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
}

export let width: number
export let height: number
export let mapCells: MapCell[][] = []
export let exploredCells: boolean[][] = []
export let exploredCellCache: MapCell[]
export let voronoiCells: VoronoiCell[][] = []
export let edges: EdgeCoordinate[] = []
export let corners: EdgeCoordinate[] = []
export let middles: VoronoiCoordinate[] = []
export let voronoiRegions: VoronoiRegion[] = []

export type VoronoiCoordinate = {
    id: number,
    x: number,
    y: number
}

export type EdgeCoordinate = {
    id: number,
    x: number,
    y: number,
    neighbouringRegions: number[]
}

export type VoronoiRegion = {
    id: number,
    coords: VoronoiCoordinate,
    edges: EdgeCoordinate[],
    corners: EdgeCoordinate[],
    neighbours: number[],
    middles: VoronoiCoordinate[]
}

export type VoronoiCell = {
    voronoiId: number,
    distance: number,
}

export type CellType = {
    name: string,
    group: string,
    colors: string[],
    bgColor: string,
    characters: string[],
    blockVision: boolean,
    blockMovement: boolean
}

export type MapCell = {
    cellType: CellType,
    light: number,
    x: number
    y: number
}

export interface GenerateCellFunction {
    (cellTypes: CellType[], x: number, y: number): CellType
}

// eslint-disable-next-line
export let generateCellFunction: GenerateCellFunction = (cellTypes: CellType[], x: number, y: number): CellType => {
    const cellType: CellType = cellTypes[randInt(0, cellTypes.length - 1)]
    return { name: cellType.name, group: cellType.group, colors: cellType.colors, bgColor: cellType.bgColor, characters: cellType.characters, blockMovement: cellType.blockMovement, blockVision: cellType.blockVision }
}

export function setGenerateCellFunction(generateFn: GenerateCellFunction) {
    generateCellFunction = generateFn
}

export function GenerateCell(cellTypes: CellType[], x: number, y: number): CellType {
    return generateCellFunction(cellTypes, x, y)
}

export interface SelectCellTypesFunction {
    (x: number, y: number): CellType[]
}

/**
 * Default function for selecting the palette of cell types to pass to the generator.
 * @param x 
 * @param y 
 * @returns 
 */
// eslint-disable-next-line
export let selectCellTypes: SelectCellTypesFunction = (x: number, y: number): CellType[] => {
    return [
            { name: `Mountains`, group: 'floors', colors: ['grey'], bgColor: '', characters: [',', '.'], blockMovement: false, blockVision: false },
            { name: `Grass`, group: 'floors', colors: ['green'], bgColor: '', characters: [',', '.'], blockMovement: false, blockVision: false }
        ]
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}

export function getVCell(x: number, y: number) {
    if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
        return null
    }
    return voronoiCells[y][x]
}

/**
 * Calculate voronoi regions and populate the map based on the locations of region cells.
 * @param voronoiPointCoords Array of centre-points for each region to calculate.
 * @param voronoiGroups Group filter(s) to use from cell types palette for each region.
 * @param voronoiCellTypes Palette of cell types to use in the generator. Group property allows selecting certain cell types based on voronoi region.
 */
export function GenerateCellsVoronoi(width: number, height: number, voronoiPointCoords: VoronoiCoordinate[], voronoiGroups: string[], voronoiCellTypes: CellType[]) {
    let voronoiPointGroups: string[] = []
    voronoiPointCoords.forEach(() => {
        voronoiPointGroups.push(voronoiGroups[randInt(0, voronoiGroups.length - 1)])
    })
    clearMap()

    Initialize(width, height, () => voronoiCellTypes)

    // Initialize blank voronoi map.
    for (let y = 0; y < height; y++) {
        const cols: VoronoiCell[] = []
        for (let x = 0; x < width; x++) {
            const voronoi = voronoiPointCoords.filter(f => f.x === x && f.y === y)
            if (voronoi.length > 0) {
                cols.push({ voronoiId: voronoi[0].id, distance: 0 })
            } else {
                cols.push({ voronoiId: -1, distance: width * height + 1 })
            }
        }
        voronoiCells.push(cols)
    }

    // Iterate voronoi points and calculate their distance values,
    // overwriting them if less than the existing calculated distance.
    for (let vp of voronoiPointCoords) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = voronoiCells[y][x]
                const dist = distance(vp.x, vp.y, x, y)
                if (dist < cell.distance) {
                    cell.distance = dist
                    cell.voronoiId = vp.id
                }
            }
        }
    }

    edges = []
    corners = []
    middles = []

    // Now we iterate the map again, but this time we annotate the 
    // graph with edges and corners populated.
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cell = getVCell(x, y)
            const cellEast = getVCell(x + 1, y)
            const cellWest = getVCell(x - 1, y)
            const cellNorth = getVCell(x, y - 1)
            const cellSouth = getVCell(x, y + 1)

            if (cell && (cell.voronoiId !== cellEast?.voronoiId || cell.voronoiId !== cellWest?.voronoiId
                || cell.voronoiId !== cellNorth?.voronoiId || cell.voronoiId !== cellSouth?.voronoiId)) {
                    let cornerCount = 0
                    cornerCount += cell.voronoiId !== cellEast?.voronoiId ? 1 : 0
                    cornerCount += cell.voronoiId !== cellWest?.voronoiId ? 1 : 0
                    cornerCount += cell.voronoiId !== cellNorth?.voronoiId ? 1 : 0
                    cornerCount += cell.voronoiId !== cellSouth?.voronoiId ? 1 : 0

                    const neighbourIds: number[] = []
                    if (cellEast && cellEast.voronoiId !== cell.voronoiId) {
                        neighbourIds.push(cellEast.voronoiId)
                    }
                    if (cellWest && cellWest.voronoiId !== cell.voronoiId) {
                        neighbourIds.push(cellWest.voronoiId)
                    }
                    if (cellSouth && cellSouth.voronoiId !== cell.voronoiId) {
                        neighbourIds.push(cellSouth.voronoiId)
                    }
                    if (cellNorth && cellNorth.voronoiId !== cell.voronoiId) {
                        neighbourIds.push(cellNorth.voronoiId)
                    }
                    
                    edges.push({ id: cell.voronoiId, x: x, y: y, neighbouringRegions: Array.from(new Set(neighbourIds)) })
                    if (cornerCount > 2) {
                        corners.push({ id: cell.voronoiId, x: x, y: y, neighbouringRegions: Array.from(new Set(neighbourIds)) })
                    }
                }
            else if (cell) {
                middles.push({ id: cell.voronoiId, x: x, y: y })
            }
        }
    }

    // Build region object with prebuilt cell data cached for fast lookups later.
    voronoiPointCoords.forEach(vp => {
        const region: VoronoiRegion = { id: vp.id,
            coords: { id: vp.id, x: vp.x, y: vp.y },
            corners: corners.filter(f => f.id === vp.id),
            edges: edges.filter(f => f.id === vp.id),
            neighbours: Array.from(new Set(edges.filter(f => f.id !== vp.id).map(m => m.id))),
            middles: middles.filter(f => f.id === vp.id)
        }
        voronoiRegions.push(region)
    })

    // Iterate regions and populate cells from cell types array.
    voronoiRegions.forEach((region, regionIndex) => {
        region.middles.forEach(cell => {
            let cellTypes: null | CellType[] = null
            try {
                cellTypes = voronoiCellTypes.filter(f => voronoiPointGroups[regionIndex].includes(f.group))
            } catch (error) {
                throw new Error(`Error getting cellType (region=${region}, regionIndex=${regionIndex}):` + error)
            }
            if (cellTypes && cellTypes.length > 0) {
                const mapCell: MapCell = { x: cell.x, y: cell.y, cellType: cellTypes[randInt(0, cellTypes.length - 1)], light: 0 }
                if (mapCell.cellType.characters.length > 1) {
                    mapCell.cellType.characters = mapCell.cellType.characters.slice(randInt(0, mapCell.cellType.characters.length - 1))
                }
                if (mapCell.cellType.colors.length > 1) {
                    mapCell.cellType.colors = mapCell.cellType.colors.slice(randInt(0, mapCell.cellType.colors.length - 1))
                }
                setCell(mapCell)
            }
        })

        region.edges.forEach(cell => {
            let cellTypes = voronoiCellTypes.filter(f => f.group.includes(voronoiPointGroups[regionIndex]))

            // If this is an edge cell we want to mix cell types of the two regions in the potential list
            // so you get a randomized blended edge.
            if (cell.neighbouringRegions.length > 0) {
                cellTypes = []
                cell.neighbouringRegions.forEach(regionId => cellTypes = [...cellTypes, ...voronoiCellTypes.filter(f => f.group.includes(voronoiPointGroups[regionId]))])
            }

            if (cellTypes.length > 0) {
                const mapCell: MapCell = { x: cell.x, y: cell.y, cellType: cellTypes[randInt(0, cellTypes.length - 1)], light: 0 }
                if (mapCell.cellType.characters.length > 1) {
                    mapCell.cellType.characters = mapCell.cellType.characters.slice(randInt(0, mapCell.cellType.characters.length - 1))
                }
                if (mapCell.cellType.colors.length > 1) {
                    mapCell.cellType.colors = mapCell.cellType.colors.slice(randInt(0, mapCell.cellType.colors.length - 1))
                }
                setCell(mapCell)
            }
        })
    })
}

export function getRegion(id: number): null | VoronoiRegion {
    const regionIndex = voronoiRegions.findIndex(f => f.id === id)
    if (regionIndex > -1) {
        return voronoiRegions[regionIndex]
    }
    return null
}

export function clearMap() {
    mapCells = []
    exploredCells = []
    voronoiCells = []
    voronoiRegions = []
}

export function SelectCellTypes(x: number, y: number, selectFn?: SelectCellTypesFunction): CellType[] {
    if (selectFn) {
        return selectFn(x, y)
    }
    return selectCellTypes(x, y)
}

export function Initialize(mapWidth: number, mapHeight: number, selectCellTypesFunction?: SelectCellTypesFunction) {
    clearMap()

    width = mapWidth
    height = mapHeight

    for (let y = 0; y < height; y++) {
        const cols: MapCell[] = []
        const expl: boolean[] = []
        for (let x = 0; x < width; x++) {
            const cell = {
                cellType: GenerateCell(SelectCellTypes(x, y, selectCellTypesFunction), x, y),
                x: x, y: y,
                light: 0
            }
            if (cell.cellType.characters.length > 1) {
                cell.cellType.characters = cell.cellType.characters.slice(randInt(0, cell.cellType.characters.length - 1))
            }
            if (cell.cellType.colors.length > 1) {
                cell.cellType.colors = cell.cellType.colors.slice(randInt(0, cell.cellType.colors.length - 1))
            }
            cols.push(cell)
            expl.push(false)
        }
        mapCells.push(cols)
        exploredCells.push(expl)
    }
}

export interface GetCellsFilterFunction {
    (cell: CellType): boolean
}

export function getCells(filterFn: GetCellsFilterFunction): MapCell[] {
    const cells: MapCell[] = []
    mapCells.forEach((row) => {
        row.forEach((cell) => {
            if (filterFn(cell.cellType)) {
                cells.push(cell)
            }
        })
    })
    return cells
}

export function getCell(x: number, y: number): null | MapCell {
    try {
        if (mapCells[y][x] === undefined) {
            return null
        } else {
            return mapCells[y][x]
        }
    } catch {
        // Ignore no-empty lint rule.
    }
    return null
}

export function setCell(mapCell: MapCell) {
    try {
        mapCells[mapCell.y][mapCell.x] = mapCell
    } catch {
        // Ignore no-empty lint rule.
    }
}

export function setExplored(x: number, y: number) {
    try {
        exploredCells[y][x] = true
    } catch {
        // Ignore no-empty lint rule.
    }
}

export function setAllExplored() {
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            exploredCells[y][x] = true
        }
    }
}

export function isExplored(x: number, y: number): boolean {
    try {
        return exploredCells[y][x]
    } catch {
        return false
    }
}

export function getExploredCells(): MapCell[] {
    exploredCellCache = []
    exploredCells.forEach((row, index) => {
        row.forEach((cell, column) => {
            if (isExplored(column, index)) {
                const cell = getCell(column, index)
                if (cell) {
                    exploredCellCache.push(cell)
                }
            }
        })
    })
    return exploredCellCache
}

export function fov(viewRadius: number, x: number, y: number): MapCell[] {
    // x = x + (viewRadius % 2 === 1 ? 0 : 1)
    // y = y + (viewRadius % 2 === 1 ? 0 : 1)

    type FovSearchResult = {
        visible: boolean,
        block: boolean,
        cells: MapCell[]
    }

    function doFov(x: number, y: number, playerX: number, playerY: number): FovSearchResult {
        const checkedCells: MapCell[] = []
        let vx = playerX - x
        let vy = playerY - y
        let ox = x
        let oy = y
        const l = Math.sqrt((x * x) + (y * y))
        vx = vx / l
        vy = vy / l

        let lightAmt = 1

        for (let i = 0; i < l; i++) {
            const cell = getCell(Math.floor(ox), Math.floor(oy))
            if (cell && cell.cellType.blockVision) {
                checkedCells.forEach(each => each.light = 0)
                lightAmt = 0
                checkedCells.push(cell)
            } else if (cell) {
                cell.light += lightAmt
                checkedCells.push(cell)
            }
            ox += vx
            oy += vy
        }
        
        const nearestWall = [...checkedCells].reverse().find(f => f.cellType.blockVision)
        if (nearestWall) {
            nearestWall.light = 1
            setCell(nearestWall)
        }
        return { visible: true, block: false, cells: checkedCells }
    }

    const cells: MapCell[] = []

    for (let i = y - viewRadius; i < y + viewRadius + 1; i++) {
        for (let j = x - viewRadius; j < x + viewRadius + 1; j++) {
            const cell = getCell(Math.floor(j), Math.floor(i))
            if (cell) {
                const fovResult = doFov(Math.floor(j), Math.floor(i), x, y)

                if (cell.light > 0 && fovResult.visible) {
                    cells.push(cell)
                }
                setCell(cell)
            }
        }
    }

    function checkCardinal(x: number, y: number) {
        const cell = getCell(x, y)
        if (cell?.cellType.blockVision) {
            cell.light = 1
            if (cells.filter(f => f.x === x && f.y === y).length === 0) {
                cells.push(cell)
            }
        }
    }

    checkCardinal(x + 1, y)
    checkCardinal(x + 1, y + 1)
    checkCardinal(x, y + 1)
    checkCardinal(x + 1, y - 1)
    checkCardinal(x - 1, y + 1)

    cells.forEach(cell => {
        setExplored(cell.x, cell.y)
    })
    return cells
}
