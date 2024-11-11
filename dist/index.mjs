var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/map.ts
var map_exports = {};
__export(map_exports, {
  GenerateCell: () => GenerateCell,
  GenerateCellsVoronoi: () => GenerateCellsVoronoi,
  Initialize: () => Initialize,
  Rect: () => Rect,
  SelectCellTypes: () => SelectCellTypes,
  clearMap: () => clearMap,
  corners: () => corners,
  distance: () => distance,
  edges: () => edges,
  exploredCellCache: () => exploredCellCache,
  exploredCells: () => exploredCells,
  fov: () => fov,
  generateCellFunction: () => generateCellFunction,
  getCell: () => getCell,
  getCells: () => getCells,
  getExploredCells: () => getExploredCells,
  getRegion: () => getRegion,
  getVCell: () => getVCell,
  height: () => height,
  isExplored: () => isExplored,
  mapCells: () => mapCells,
  middles: () => middles,
  selectCellTypes: () => selectCellTypes,
  setAllExplored: () => setAllExplored,
  setCell: () => setCell,
  setExplored: () => setExplored,
  setGenerateCellFunction: () => setGenerateCellFunction,
  voronoiCells: () => voronoiCells,
  voronoiRegions: () => voronoiRegions,
  width: () => width
});

// src/random.ts
var random_exports = {};
__export(random_exports, {
  rand: () => rand,
  randInt: () => randInt,
  useRandomFloatFn: () => useRandomFloatFn
});
var randomFloatFunction = (min, max) => {
  return Math.random() * (max - min) + min;
};
function useRandomFloatFn(randomFn) {
  randomFloatFunction = randomFn;
}
function randInt(min, max) {
  return Math.round(randomFloatFunction(min, max));
}
function rand(min, max) {
  return randomFloatFunction(min, max);
}

// src/map.ts
var Rect = class {
  x;
  y;
  w;
  h;
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
};
var width;
var height;
var mapCells = [];
var exploredCells = [];
var exploredCellCache;
var voronoiCells = [];
var edges = [];
var corners = [];
var middles = [];
var voronoiRegions = [];
var generateCellFunction = (cellTypes, x, y) => {
  const cellType = cellTypes[randInt(0, cellTypes.length - 1)];
  return { name: cellType.name, group: cellType.group, colors: cellType.colors, bgColor: cellType.bgColor, characters: cellType.characters, blockMovement: cellType.blockMovement, blockVision: cellType.blockVision };
};
function setGenerateCellFunction(generateFn) {
  generateCellFunction = generateFn;
}
function GenerateCell(cellTypes, x, y) {
  return generateCellFunction(cellTypes, x, y);
}
var selectCellTypes = (x, y) => {
  return [
    { name: `Mountains`, group: "floors", colors: ["grey"], bgColor: "", characters: [",", "."], blockMovement: false, blockVision: false },
    { name: `Grass`, group: "floors", colors: ["green"], bgColor: "", characters: [",", "."], blockMovement: false, blockVision: false }
  ];
};
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}
function getVCell(x, y) {
  if (x < 0 || x > width - 1 || y < 0 || y > height - 1) {
    return null;
  }
  return voronoiCells[y][x];
}
function GenerateCellsVoronoi(width3, height3, voronoiPointCoords, voronoiGroups, voronoiCellTypes) {
  let voronoiPointGroups = [];
  voronoiPointCoords.forEach(() => {
    voronoiPointGroups.push(voronoiGroups[randInt(0, voronoiGroups.length - 1)]);
  });
  clearMap();
  Initialize(width3, height3, () => voronoiCellTypes);
  for (let y = 0; y < height3; y++) {
    const cols = [];
    for (let x = 0; x < width3; x++) {
      const voronoi = voronoiPointCoords.filter((f) => f.x === x && f.y === y);
      if (voronoi.length > 0) {
        cols.push({ voronoiId: voronoi[0].id, distance: 0 });
      } else {
        cols.push({ voronoiId: -1, distance: width3 * height3 + 1 });
      }
    }
    voronoiCells.push(cols);
  }
  for (let vp of voronoiPointCoords) {
    for (let y = 0; y < height3; y++) {
      for (let x = 0; x < width3; x++) {
        const cell = voronoiCells[y][x];
        const dist = distance(vp.x, vp.y, x, y);
        if (dist < cell.distance) {
          cell.distance = dist;
          cell.voronoiId = vp.id;
        }
      }
    }
  }
  edges = [];
  corners = [];
  middles = [];
  for (let y = 0; y < height3; y++) {
    for (let x = 0; x < width3; x++) {
      const cell = getVCell(x, y);
      const cellEast = getVCell(x + 1, y);
      const cellWest = getVCell(x - 1, y);
      const cellNorth = getVCell(x, y - 1);
      const cellSouth = getVCell(x, y + 1);
      if (cell && (cell.voronoiId !== cellEast?.voronoiId || cell.voronoiId !== cellWest?.voronoiId || cell.voronoiId !== cellNorth?.voronoiId || cell.voronoiId !== cellSouth?.voronoiId)) {
        let cornerCount = 0;
        cornerCount += cell.voronoiId !== cellEast?.voronoiId ? 1 : 0;
        cornerCount += cell.voronoiId !== cellWest?.voronoiId ? 1 : 0;
        cornerCount += cell.voronoiId !== cellNorth?.voronoiId ? 1 : 0;
        cornerCount += cell.voronoiId !== cellSouth?.voronoiId ? 1 : 0;
        const neighbourIds = [];
        if (cellEast && cellEast.voronoiId !== cell.voronoiId) {
          neighbourIds.push(cellEast.voronoiId);
        }
        if (cellWest && cellWest.voronoiId !== cell.voronoiId) {
          neighbourIds.push(cellWest.voronoiId);
        }
        if (cellSouth && cellSouth.voronoiId !== cell.voronoiId) {
          neighbourIds.push(cellSouth.voronoiId);
        }
        if (cellNorth && cellNorth.voronoiId !== cell.voronoiId) {
          neighbourIds.push(cellNorth.voronoiId);
        }
        edges.push({ id: cell.voronoiId, x, y, neighbouringRegions: Array.from(new Set(neighbourIds)) });
        if (cornerCount > 2) {
          corners.push({ id: cell.voronoiId, x, y, neighbouringRegions: Array.from(new Set(neighbourIds)) });
        }
      } else if (cell) {
        middles.push({ id: cell.voronoiId, x, y });
      }
    }
  }
  voronoiPointCoords.forEach((vp) => {
    const region = {
      id: vp.id,
      coords: { id: vp.id, x: vp.x, y: vp.y },
      corners: corners.filter((f) => f.id === vp.id),
      edges: edges.filter((f) => f.id === vp.id),
      neighbours: Array.from(new Set(edges.filter((f) => f.id !== vp.id).map((m) => m.id))),
      middles: middles.filter((f) => f.id === vp.id)
    };
    voronoiRegions.push(region);
  });
  voronoiRegions.forEach((region, regionIndex) => {
    region.middles.forEach((cell) => {
      const cellTypes = voronoiCellTypes.filter((f) => voronoiPointGroups[regionIndex].includes(f.group));
      if (cellTypes.length > 0) {
        const mapCell = { x: cell.x, y: cell.y, cellType: cellTypes[randInt(0, cellTypes.length - 1)], light: 0 };
        if (mapCell.cellType.characters.length > 1) {
          mapCell.cellType.characters = mapCell.cellType.characters.slice(randInt(0, mapCell.cellType.characters.length - 1));
        }
        if (mapCell.cellType.colors.length > 1) {
          mapCell.cellType.colors = mapCell.cellType.colors.slice(randInt(0, mapCell.cellType.colors.length - 1));
        }
        setCell(mapCell);
      }
    });
    region.edges.forEach((cell) => {
      let cellTypes = voronoiCellTypes.filter((f) => f.group.includes(voronoiPointGroups[regionIndex]));
      if (cell.neighbouringRegions.length > 0) {
        cellTypes = [];
        cell.neighbouringRegions.forEach((regionId) => cellTypes = [...cellTypes, ...voronoiCellTypes.filter((f) => f.group.includes(voronoiPointGroups[regionId]))]);
      }
      if (cellTypes.length > 0) {
        const mapCell = { x: cell.x, y: cell.y, cellType: cellTypes[randInt(0, cellTypes.length - 1)], light: 0 };
        if (mapCell.cellType.characters.length > 1) {
          mapCell.cellType.characters = mapCell.cellType.characters.slice(randInt(0, mapCell.cellType.characters.length - 1));
        }
        if (mapCell.cellType.colors.length > 1) {
          mapCell.cellType.colors = mapCell.cellType.colors.slice(randInt(0, mapCell.cellType.colors.length - 1));
        }
        setCell(mapCell);
      }
    });
  });
}
function getRegion(id) {
  const regionIndex = voronoiRegions.findIndex((f) => f.id === id);
  if (regionIndex > -1) {
    return voronoiRegions[regionIndex];
  }
  return null;
}
function clearMap() {
  mapCells = [];
  exploredCells = [];
  voronoiCells = [];
  voronoiRegions = [];
}
function SelectCellTypes(x, y, selectFn) {
  if (selectFn) {
    return selectFn(x, y);
  }
  return selectCellTypes(x, y);
}
function Initialize(mapWidth, mapHeight, selectCellTypesFunction) {
  clearMap();
  width = mapWidth;
  height = mapHeight;
  for (let y = 0; y < height; y++) {
    const cols = [];
    const expl = [];
    for (let x = 0; x < width; x++) {
      const cell = {
        cellType: GenerateCell(SelectCellTypes(x, y, selectCellTypesFunction), x, y),
        x,
        y,
        light: 0
      };
      if (cell.cellType.characters.length > 1) {
        cell.cellType.characters = cell.cellType.characters.slice(randInt(0, cell.cellType.characters.length - 1));
      }
      if (cell.cellType.colors.length > 1) {
        cell.cellType.colors = cell.cellType.colors.slice(randInt(0, cell.cellType.colors.length - 1));
      }
      cols.push(cell);
      expl.push(false);
    }
    mapCells.push(cols);
    exploredCells.push(expl);
  }
}
function getCells(filterFn) {
  const cells = [];
  mapCells.forEach((row) => {
    row.forEach((cell) => {
      if (filterFn(cell.cellType)) {
        cells.push(cell);
      }
    });
  });
  return cells;
}
function getCell(x, y) {
  try {
    if (mapCells[y][x] === void 0) {
      return null;
    } else {
      return mapCells[y][x];
    }
  } catch {
  }
  return null;
}
function setCell(mapCell) {
  try {
    mapCells[mapCell.y][mapCell.x] = mapCell;
  } catch {
  }
}
function setExplored(x, y) {
  try {
    exploredCells[y][x] = true;
  } catch {
  }
}
function setAllExplored() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      exploredCells[y][x] = true;
    }
  }
}
function isExplored(x, y) {
  try {
    return exploredCells[y][x];
  } catch {
    return false;
  }
}
function getExploredCells() {
  exploredCellCache = [];
  exploredCells.forEach((row, index) => {
    row.forEach((cell, column) => {
      if (isExplored(column, index)) {
        const cell2 = getCell(column, index);
        if (cell2) {
          exploredCellCache.push(cell2);
        }
      }
    });
  });
  return exploredCellCache;
}
function fov(viewRadius, x, y) {
  function doFov(x2, y2, playerX, playerY) {
    const checkedCells = [];
    let vx = playerX - x2;
    let vy = playerY - y2;
    let ox = x2;
    let oy = y2;
    const l = Math.sqrt(x2 * x2 + y2 * y2);
    vx = vx / l;
    vy = vy / l;
    let lightAmt = 1;
    for (let i = 0; i < l; i++) {
      const cell = getCell(Math.floor(ox), Math.floor(oy));
      if (cell && cell.cellType.blockVision) {
        checkedCells.forEach((each) => each.light = 0);
        lightAmt = 0;
        checkedCells.push(cell);
      } else if (cell) {
        cell.light += lightAmt;
        checkedCells.push(cell);
      }
      ox += vx;
      oy += vy;
    }
    const nearestWall = [...checkedCells].reverse().find((f) => f.cellType.blockVision);
    if (nearestWall) {
      nearestWall.light = 1;
      setCell(nearestWall);
    }
    return { visible: true, block: false, cells: checkedCells };
  }
  const cells = [];
  for (let i = y - viewRadius; i < y + viewRadius + 1; i++) {
    for (let j = x - viewRadius; j < x + viewRadius + 1; j++) {
      const cell = getCell(Math.floor(j), Math.floor(i));
      if (cell) {
        const fovResult = doFov(Math.floor(j), Math.floor(i), x, y);
        if (cell.light > 0 && fovResult.visible) {
          cells.push(cell);
        }
        setCell(cell);
      }
    }
  }
  function checkCardinal(x2, y2) {
    const cell = getCell(x2, y2);
    if (cell?.cellType.blockVision) {
      cell.light = 1;
      if (cells.filter((f) => f.x === x2 && f.y === y2).length === 0) {
        cells.push(cell);
      }
    }
  }
  checkCardinal(x + 1, y);
  checkCardinal(x + 1, y + 1);
  checkCardinal(x, y + 1);
  checkCardinal(x + 1, y - 1);
  checkCardinal(x - 1, y + 1);
  cells.forEach((cell) => {
    setExplored(cell.x, cell.y);
  });
  return cells;
}

// src/index.ts
var width2 = 256;
var height2 = 256;
export {
  height2 as height,
  map_exports as map,
  random_exports as random,
  width2 as width
};
