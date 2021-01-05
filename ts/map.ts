import {
  utils as Utils,
  random,
  grid as Grid,
  fov as Fov,
  flag as Flag,
  path as Path,
  color as Color,
  colors as COLORS,
  canvas as Canvas,
  config as CONFIG,
  data as DATA,
  types as Types,
  make as Make,
} from "gw-utils";

import * as Cell from "./cell";
import * as Tile from "./tile";
import {
  Map as Flags,
  Cell as CellFlags,
  Tile as TileFlags,
  CellMech as CellMechFlags,
  TileMech as TileMechFlags,
  Layer as TileLayer,
} from "./flags";
import { Light } from "./light";

export { Flags };

Utils.setDefaults(CONFIG, {
  "map.deepestLevel": 99,
});

export type MapEachFn = (
  cell: Cell.Cell,
  x: number,
  y: number,
  map: Map
) => void;

export type MapMatchFn = (
  cell: Cell.Cell,
  x: number,
  y: number,
  map: Map
) => boolean;

export type MapCostFn = (
  cell: Cell.Cell,
  x: number,
  y: number,
  map: Map
) => number;

export interface MapMatchOptions {
  hallways: boolean;
  blockingMap: Grid.NumGrid;
  liquids: boolean;
  match: MapMatchFn;
  forbidCellFlags: number;
  forbidTileFlags: number;
  forbidTileMechFlags: number;
  tile: Tile.Tile;
  tries: number;
  deterministic: boolean;
}

interface LightInfo extends Utils.Chainable {
  light: Light;
  x: number;
  y: number;
  next: LightInfo | null;
}

export type MapLightFn = (light: Light, x: number, y: number) => void;

export interface DisruptsOptions {
  gridOffsetX: number;
  gridOffsetY: number;
  bounds: Types.Bounds | null;
}

export class Map implements Types.MapType {
  protected _width: number;
  protected _height: number;
  public cells: Grid.Grid<Cell.Cell>;
  public locations: any = {};
  public config: any = {};
  protected _actors: any | null = null;
  protected _items: any | null = null;
  public flags = 0;
  public ambientLight: Color.Color | null = null;
  public lights: LightInfo | null = null;
  public id: string;
  public events: any = {};

  constructor(w: number, h: number, opts: any = {}) {
    this._width = w;
    this._height = h;
    this.cells = Grid.make<Cell.Cell>(
      w,
      h,
      () => new Cell.Cell()
    ) as Grid.Grid<Cell.Cell>;
    this.locations = opts.locations || {};
    this.config = Object.assign({}, opts);
    this.config.tick = this.config.tick || 100;
    this._actors = null;
    this._items = null;
    this.flags = Flag.from(Flags, Flags.MAP_DEFAULT, opts.flags);
    this.ambientLight = null;
    const ambient = opts.ambient || opts.ambientLight || opts.light;
    if (ambient) {
      this.ambientLight = Color.make(ambient);
    }
    this.lights = null;
    this.id = opts.id;
    this.events = opts.events || {};
  }

  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }

  async start() {}

  nullify() {
    this.cells.forEach((c) => c.nullify());
  }
  dump(fmt?: (cell: Cell.Cell) => string) {
    this.cells.dump(fmt || ((c: Cell.Cell) => c.dump()));
  }
  cell(x: number, y: number) {
    return this.cells[x][y];
  }

  eachCell(fn: MapEachFn) {
    this.cells.forEach((c, i, j) => fn(c, i, j, this));
  }
  forEach(fn: MapEachFn) {
    this.cells.forEach((c, i, j) => fn(c, i, j, this));
  }
  forRect(x: number, y: number, w: number, h: number, fn: MapEachFn) {
    this.cells.forRect(x, y, w, h, (c, i, j) => fn(c, i, j, this));
  }
  eachNeighbor(x: number, y: number, fn: MapEachFn, only4dirs = false) {
    this.cells.eachNeighbor(x, y, (c, i, j) => fn(c, i, j, this), only4dirs);
  }

  hasXY(x: number, y: number) {
    return this.cells.hasXY(x, y);
  }
  isBoundaryXY(x: number, y: number) {
    return this.cells.isBoundaryXY(x, y);
  }

  changed(v?: boolean) {
    if (v === true) {
      this.flags |= Flags.MAP_CHANGED;
    } else if (v === false) {
      this.flags &= ~Flags.MAP_CHANGED;
    }
    return this.flags & Flags.MAP_CHANGED;
  }

  hasCellFlag(x: number, y: number, flag: number) {
    return this.cell(x, y).flags & flag;
  }
  hasCellMechFlag(x: number, y: number, flag: number) {
    return this.cell(x, y).mechFlags & flag;
  }
  hasTileFlag(x: number, y: number, flag: number) {
    return this.cell(x, y).hasTileFlag(flag);
  }
  hasTileMechFlag(x: number, y: number, flag: number) {
    return this.cell(x, y).hasTileMechFlag(flag);
  }

  setCellFlag(x: number, y: number, flag: number) {
    this.cell(x, y).flags |= flag;
  }

  redrawCell(cell: Cell.Cell) {
    // if (cell.isAnyKindOfVisible()) {
    cell._needsRedraw();
    this.flags |= Flags.MAP_CHANGED;
    // }
  }

  redrawXY(x: number, y: number) {
    const cell = this.cell(x, y);
    this.redrawCell(cell);
  }

  redrawAll() {
    this.forEach((c) => {
      // if (c.isAnyKindOfVisible()) {
      c.flags |= CellFlags.NEEDS_REDRAW;
      // }
    });
    this.flags |= Flags.MAP_CHANGED;
  }

  revealAll() {
    this.forEach((c) => {
      c.markRevealed();
      c.storeMemory();
    });
  }

  markRevealed(x: number, y: number) {
    if (!this.cell(x, y).markRevealed()) return;
    if (DATA.player) {
      DATA.player.invalidateCostMap();
    }
  }
  isVisible(x: number, y: number) {
    return this.cell(x, y).isVisible();
  }
  isAnyKindOfVisible(x: number, y: number) {
    return this.cell(x, y).isAnyKindOfVisible();
  }
  isOrWasAnyKindOfVisible(x: number, y: number) {
    return this.cell(x, y).isOrWasAnyKindOfVisible();
  }
  hasVisibleLight(x: number, y: number) {
    return this.cell(x, y).hasVisibleLight();
  }

  setFlag(flag: number) {
    this.flags |= flag;
    this.changed(true);
  }

  setFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
    if (mapFlag) {
      this.flags |= mapFlag;
    }
    if (cellFlag || cellMechFlag) {
      this.forEach((c) => c.setFlags(cellFlag, cellMechFlag));
    }
    this.changed(true);
  }

  clearFlag(flag: number) {
    this.flags &= ~flag;
    this.changed(true);
  }

  clearFlags(mapFlag = 0, cellFlag = 0, cellMechFlag = 0) {
    if (mapFlag) {
      this.flags &= ~mapFlag;
    }
    if (cellFlag || cellMechFlag) {
      this.forEach((cell) => cell.clearFlags(cellFlag, cellMechFlag));
    }
    this.changed(true);
  }

  setCellFlags(x: number, y: number, cellFlag = 0, cellMechFlag = 0) {
    this.cell(x, y).setFlags(cellFlag, cellMechFlag);
    this.flags |= Flags.MAP_CHANGED;
  }

  clearCellFlags(x: number, y: number, cellFlags = 0, cellMechFlags = 0) {
    this.cell(x, y).clearFlags(cellFlags, cellMechFlags);
    this.changed(true);
  }

  hasTile(x: number, y: number, tile: string) {
    return this.cells[x][y].hasTile(tile);
  }

  tileFlags(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].tileFlags(limitToPlayerKnowledge);
  }
  tileMechFlags(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].tileMechFlags(limitToPlayerKnowledge);
  }

  tileWithFlag(x: number, y: number, flag = 0) {
    return this.cells[x][y].tileWithFlag(flag);
  }
  tileWithMechFlag(x: number, y: number, mechFlag = 0) {
    return this.cells[x][y].tileWithMechFlag(mechFlag);
  }

  hasKnownTileFlag(x: number, y: number, flagMask = 0) {
    return this.cells[x][y].memory.tileFlags & flagMask;
  }

  // hasTileInGroup(x, y, ...groups) { return this.cells[x][y].hasTileInGroup(...groups); }

  discoveredTileFlags(x: number, y: number) {
    return this.cells[x][y].discoveredTileFlags();
  }
  hasDiscoveredTileFlag(x: number, y: number, flag = 0) {
    return this.cells[x][y].hasDiscoveredTileFlag(flag);
  }

  canBePassed(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].canBePassed(limitToPlayerKnowledge);
  }
  isPassableNow(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].isPassableNow(limitToPlayerKnowledge);
  }

  isNull(x: number, y: number) {
    return this.cells[x][y].isNull();
  }
  isEmpty(x: number, y: number) {
    return this.cells[x][y].isEmpty();
  }
  isObstruction(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].isObstruction(limitToPlayerKnowledge);
  }
  isDoor(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].isDoor(limitToPlayerKnowledge);
  }
  isLiquid(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].isLiquid(limitToPlayerKnowledge);
  }
  hasGas(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].hasGas(limitToPlayerKnowledge);
  }

  blocksPathing(x: number, y: number, limitToPlayerKnowledge = false) {
    return this.cells[x][y].blocksPathing(limitToPlayerKnowledge);
  }
  blocksVision(x: number, y: number) {
    return this.cells[x][y].blocksVision();
  }

  highestPriorityTile(x: number, y: number, skipGas = false) {
    return this.cells[x][y].highestPriorityTile(skipGas);
  }

  tileFlavor(x: number, y: number) {
    return this.cells[x][y].tileFlavor();
  }

  setTile(x: number, y: number, tileId: string | null, volume = 0) {
    return this.cell(x, y)._setTile(tileId, volume, this);
  }

  clearLayersWithFlags(
    x: number,
    y: number,
    tileFlags: number,
    tileMechFlags = 0
  ) {
    const cell = this.cell(x, y);
    cell.clearLayersWithFlags(tileFlags, tileMechFlags);
  }

  clearCellLayers(
    x: number,
    y: number,
    nullLiquid = true,
    nullSurface = true,
    nullGas = true
  ) {
    this.changed(true);
    return this.cell(x, y).nullifyLayers(nullLiquid, nullSurface, nullGas);
  }

  fill(tileId: string | null, boundaryTile?: string | null) {
    let i, j;
    if (boundaryTile === undefined) {
      boundaryTile = tileId;
    }
    for (i = 0; i < this.width; ++i) {
      for (j = 0; j < this.height; ++j) {
        if (this.isBoundaryXY(i, j)) {
          this.setTile(i, j, boundaryTile);
        } else {
          this.setTile(i, j, tileId);
        }
      }
    }
  }

  neighborCount(x: number, y: number, matchFn: MapMatchFn, only4dirs = false) {
    let count = 0;
    this.eachNeighbor(
      x,
      y,
      (...args) => {
        if (matchFn(...args)) ++count;
      },
      only4dirs
    );
    return count;
  }

  passableArcCount(x: number, y: number) {
    if (!this.hasXY(x, y)) return -1;
    return this.cells.arcCount(x, y, (c) => c.isPassableNow());
  }

  diagonalBlocked(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    limitToPlayerKnowledge = false
  ) {
    if (x1 == x2 || y1 == y2) {
      return false; // If it's not a diagonal, it's not diagonally blocked.
    }
    const locFlags1 = this.tileFlags(x1, y2, limitToPlayerKnowledge);
    if (locFlags1 & TileFlags.T_OBSTRUCTS_DIAGONAL_MOVEMENT) {
      return true;
    }
    const locFlags2 = this.tileFlags(x2, y1, limitToPlayerKnowledge);
    if (locFlags2 & TileFlags.T_OBSTRUCTS_DIAGONAL_MOVEMENT) {
      return true;
    }
    return false;
  }

  fillCostGrid(costGrid: Grid.NumGrid, costFn: MapCostFn) {
    costFn = costFn || Utils.ONE;
    this.cells.forEach((cell, i, j) => {
      if (cell.isNull()) {
        costGrid[i][j] = Path.OBSTRUCTION;
      } else {
        costGrid[i][j] = cell.canBePassed()
          ? costFn(cell, i, j, this)
          : Path.OBSTRUCTION;
      }
    });
  }

  matchingNeighbor(
    x: number,
    y: number,
    matcher: MapMatchFn,
    only4dirs = false
  ) {
    const maxIndex = only4dirs ? 4 : 8;
    for (let d = 0; d < maxIndex; ++d) {
      const dir = Utils.DIRS[d];
      const i = x + dir[0];
      const j = y + dir[1];
      if (this.hasXY(i, j)) {
        if (matcher(this.cells[i][j], i, j, this)) return [i, j];
      }
    }
    return null;
  }

  // blockingMap is optional
  matchingLocNear(
    x: number,
    y: number,
    opts: Partial<MapMatchOptions>
  ): Utils.Loc;
  matchingLocNear(
    x: number,
    y: number,
    matcher: MapMatchFn,
    opts?: Partial<MapMatchOptions>
  ): Utils.Loc;
  matchingLocNear(x: number, y: number, ...args: any[]) {
    let i, j, k;

    let matcher: MapMatchFn = args[0];
    let opts: Partial<MapMatchOptions> = args[1] || {};

    const arg = args[0];
    if (typeof arg !== "function") {
      opts = arg || args[1];
      matcher = opts.match || Utils.TRUE;
    }

    const hallwaysAllowed = opts.hallways || false;
    const blockingMap = opts.blockingMap || null;
    const forbidLiquid = opts.liquids === false;
    const deterministic = opts.deterministic || false;

    const candidateLocs = [];

    // count up the number of candidate locations
    for (
      k = 0;
      k < Math.max(this.width, this.height) && !candidateLocs.length;
      k++
    ) {
      for (i = x - k; i <= x + k; i++) {
        for (j = y - k; j <= y + k; j++) {
          if (!this.hasXY(i, j)) continue;
          const cell = this.cell(i, j);
          // if ((i == x-k || i == x+k || j == y-k || j == y+k)
          if (
            Math.ceil(Utils.distanceBetween(x, y, i, j)) == k &&
            (!blockingMap || !blockingMap[i][j]) &&
            matcher(cell, i, j, this) &&
            (!forbidLiquid || !cell.liquid) &&
            (hallwaysAllowed || this.passableArcCount(i, j) < 2)
          ) {
            candidateLocs.push([i, j]);
          }
        }
      }
    }

    if (candidateLocs.length == 0) {
      return [-1, -1];
    }

    // and pick one
    let randIndex = 0;
    if (deterministic) {
      randIndex = Math.floor(candidateLocs.length / 2);
    } else {
      randIndex = random.number(candidateLocs.length);
    }
    return candidateLocs[randIndex];
  }

  // fills (*x, *y) with the coordinates of a random cell with
  // no creatures, items or stairs and with either a matching liquid and dungeon type
  // or at least one layer of type terrainType.
  // A dungeon, liquid type of -1 will match anything.
  randomMatchingLoc(opts: Partial<MapMatchOptions> = {}) {
    let x;
    let y;
    let cell;

    if (typeof opts === "function") {
      opts = { match: opts };
    }

    const hallwaysAllowed = opts.hallways || false;
    const blockingMap = opts.blockingMap || null;
    const forbidLiquid = opts.liquids === false;
    const matcher = opts.match || Utils.TRUE;
    const forbidCellFlags = opts.forbidCellFlags || 0;
    const forbidTileFlags = opts.forbidTileFlags || 0;
    const forbidTileMechFlags = opts.forbidTileMechFlags || 0;
    const tile = opts.tile || null;
    let tries = opts.tries || 500;

    let retry = true;
    while (retry) {
      tries--;
      if (!tries) break;

      x = random.range(0, this.width - 1);
      y = random.range(0, this.height - 1);
      cell = this.cell(x, y);

      if (
        (!blockingMap || !blockingMap[x][y]) &&
        (!tile || cell.hasTile(tile)) &&
        (!forbidLiquid || !cell.liquid) &&
        (!forbidCellFlags || !(cell.flags & forbidCellFlags)) &&
        (!forbidTileFlags || !cell.hasTileFlag(forbidTileFlags)) &&
        (!forbidTileMechFlags || !cell.hasTileMechFlag(forbidTileMechFlags)) &&
        (hallwaysAllowed || this.passableArcCount(x, y) < 2) &&
        matcher(cell, x, y, this)
      ) {
        retry = false;
      }
    }

    if (!tries) {
      // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => FAIL');
      return false;
    }

    // map.debug('randomMatchingLocation', dungeonType, liquidType, terrainType, ' => ', x, y);
    return [x, y];
  }

  // LIGHT

  addLight(x: number, y: number, light: Light) {
    const info: LightInfo = { x, y, light, next: this.lights };
    this.lights = info;
    this.flags &= ~(Flags.MAP_STABLE_LIGHTS | Flags.MAP_STABLE_GLOW_LIGHTS);
    return info;
  }

  removeLight(info: LightInfo) {
    Utils.removeFromChain(this, "lights", info);
    this.flags &= ~(Flags.MAP_STABLE_LIGHTS | Flags.MAP_STABLE_GLOW_LIGHTS);
  }

  eachGlowLight(fn: MapLightFn) {
    Utils.eachChain(this.lights, (info: LightInfo) =>
      fn(info.light, info.x, info.y)
    );
    this.eachCell((cell, x, y) => {
      for (let tile of cell.tiles()) {
        if (tile.light) {
          fn(tile.light, x, y);
        }
      }
    });
  }

  eachDynamicLight(fn: MapLightFn) {
    Utils.eachChain(this._actors, (actor: any) => {
      if (actor.light) fn(actor.light, actor.x, actor.y);
    });
  }

  // FX

  addFx(x: number, y: number, anim: Types.FxType) {
    if (!this.hasXY(x, y)) return false;
    const cell = this.cell(x, y);
    cell.addSprite(anim.sprite, TileLayer.FX);
    anim.x = x;
    anim.y = y;
    this.redrawCell(cell);
    return true;
  }

  moveFx(x: number, y: number, anim: Types.FxType) {
    if (!this.hasXY(x, y)) return false;
    const cell = this.cell(x, y);
    const oldCell = this.cell(anim.x, anim.y);
    oldCell.removeSprite(anim.sprite);
    this.redrawCell(oldCell);
    cell.addSprite(anim.sprite, TileLayer.FX);
    this.redrawCell(cell);
    anim.x = x;
    anim.y = y;
    return true;
  }

  removeFx(anim: Types.FxType) {
    const oldCell = this.cell(anim.x, anim.y);
    oldCell.removeSprite(anim.sprite);
    this.redrawCell(oldCell);
    this.flags |= Flags.MAP_CHANGED;
    return true;
  }

  // ACTORS

  // will return the PLAYER if the PLAYER is at (x, y).
  actorAt(x: number, y: number): Types.ActorType | null {
    // creature *
    if (!this.hasXY(x, y)) return null;
    const cell = this.cell(x, y);
    return cell.actor;
  }

  addActor(x: number, y: number, theActor: Types.ActorType) {
    if (!this.hasXY(x, y)) return false;
    const cell = this.cell(x, y);
    if (cell.actor) {
      return false;
    }

    cell.actor = theActor;
    theActor.next = this._actors;
    this._actors = theActor;

    const layer = theActor === DATA.player ? TileLayer.PLAYER : TileLayer.ACTOR;
    cell.addSprite(theActor.sprite, layer);

    const flag =
      theActor === DATA.player ? CellFlags.HAS_PLAYER : CellFlags.HAS_MONSTER;
    cell.flags |= flag;
    // if (theActor.flags & Flags.Actor.MK_DETECTED)
    // {
    // 	cell.flags |= CellFlags.MONSTER_DETECTED;
    // }

    if (theActor.light) {
      this.flags &= ~Flags.MAP_STABLE_LIGHTS;
    }

    // If the player moves or an actor that blocks vision and the cell is visible...
    // -- we need to update the FOV
    if (
      theActor.isPlayer() ||
      (cell.isAnyKindOfVisible() && theActor.blocksVision())
    ) {
      this.flags |= Flags.MAP_FOV_CHANGED;
    }

    theActor.x = x;
    theActor.y = y;
    this.redrawCell(cell);

    return true;
  }

  addActorNear(x: number, y: number, theActor: Types.ActorType) {
    const loc = this.matchingLocNear(x, y, (cell) => {
      return theActor.avoidsCell(cell);
    });
    if (!loc || loc[0] < 0) {
      // GW.ui.message(colors.badMessageColor, 'There is no place to put the actor.');
      return false;
    }

    return this.addActor(loc[0], loc[1], theActor);
  }

  moveActor(x: number, y: number, actor: Types.ActorType) {
    if (!this.hasXY(x, y)) return false;
    this.removeActor(actor);

    if (!this.addActor(x, y, actor)) {
      this.addActor(actor.x, actor.y, actor);
      return false;
    }
    if (actor.light) {
      this.flags &= ~Flags.MAP_STABLE_LIGHTS;
    }

    return true;
  }

  removeActor(actor: Types.ActorType) {
    if (!this.hasXY(actor.x, actor.y)) return false;
    const cell = this.cell(actor.x, actor.y);
    if (cell.actor === actor) {
      cell.actor = null;
      Utils.removeFromChain(this, "actors", actor);
      cell.flags &= ~CellFlags.HAS_ACTOR;
      cell.removeSprite(actor.sprite);

      if (actor.light) {
        this.flags &= ~Flags.MAP_STABLE_LIGHTS;
      }
      // If the player moves or an actor that blocks vision and the cell is visible...
      // -- we need to update the FOV
      if (
        actor.isPlayer() ||
        (cell.isAnyKindOfVisible() && actor.blocksVision())
      ) {
        this.flags |= Flags.MAP_FOV_CHANGED;
      }

      this.redrawCell(cell);
      return true;
    }
    return false;
  }

  deleteActorAt(x: number, y: number) {
    const actor = this.actorAt(x, y);
    if (!actor) return false;
    this.removeActor(actor);
    actor.delete();
    return true;
  }

  // dormantAt(x: number, y: number) {  // creature *
  // 	if (!(this.cell(x, y).flags & CellFlags.HAS_DORMANT_MONSTER)) {
  // 		return null;
  // 	}
  // 	return this.dormantActors.find( (m) => m.x == x && m.y == y );
  // }
  //
  // addDormant(x, y, actor) {
  // 	theActor.x = x;
  // 	theActor.y = y;
  // 	this.dormant.add(theActor);
  // 	cell.flags |= (CellFlags.HAS_DORMANT_MONSTER);
  // 	this.flags |= Flags.MAP_CHANGED;
  // 	return true;
  // }
  //
  // removeDormant(actor) {
  // 	const cell = this.cell(actor.x, actor.y);
  // 	cell.flags &= ~(CellFlags.HAS_DORMANT_MONSTER);
  // 	cell.flags |= CellFlags.NEEDS_REDRAW;
  // 	this.flags |= Flags.MAP_CHANGED;
  // 	this.dormant.remove(actor);
  // }

  // ITEMS

  itemAt(x: number, y: number): Types.ItemType | null {
    const cell = this.cell(x, y);
    return cell.item;
  }

  addItem(x: number, y: number, theItem: Types.ItemType) {
    if (!this.hasXY(x, y)) return false;
    const cell = this.cell(x, y);
    if (cell.flags & CellFlags.HAS_ITEM) {
      // GW.ui.message(colors.badMessageColor, 'There is already an item there.');
      return false;
    }
    theItem.x = x;
    theItem.y = y;

    cell.item = theItem;
    theItem.next = this._items;
    this._items = theItem;

    cell.addSprite(theItem.sprite, TileLayer.ITEM);
    cell.flags |= CellFlags.HAS_ITEM;

    if (theItem.light) {
      this.flags &= ~Flags.MAP_STABLE_LIGHTS;
    }

    this.redrawCell(cell);

    if (theItem.isDetected() || CONFIG.D_ITEM_OMNISCIENCE) {
      cell.flags |= CellFlags.ITEM_DETECTED;
    }

    return true;
  }

  addItemNear(x: number, y: number, theItem: Types.ItemType) {
    const loc = this.matchingLocNear(x, y, (cell) => {
      return theItem.forbidsCell(cell);
    });
    if (!loc || loc[0] < 0) {
      // GW.ui.message(colors.badMessageColor, 'There is no place to put the item.');
      return false;
    }

    return this.addItem(loc[0], loc[1], theItem);
  }

  removeItem(theItem: Types.ItemType) {
    const x = theItem.x;
    const y = theItem.y;
    if (!this.hasXY(x, y)) return false;
    const cell = this.cell(x, y);
    if (cell.item !== theItem) return false;

    cell.removeSprite(theItem.sprite);

    cell.item = null;
    Utils.removeFromChain(this, "items", theItem);

    if (theItem.light) {
      this.flags &= ~Flags.MAP_STABLE_LIGHTS;
    }

    cell.flags &= ~(CellFlags.HAS_ITEM | CellFlags.ITEM_DETECTED);
    this.redrawCell(cell);
    return true;
  }

  // // PROMOTE
  //
  // async promote(x, y, mechFlag) {
  // 	if (this.hasTileMechFlag(x, y, mechFlag)) {
  // 		const cell = this.cell(x, y);
  // 		for (let tile of cell.tiles()) {
  // 			if (tile.mechFlags & mechFlag) {
  // 				await tile.promote(this, x, y, false);
  // 			}
  // 		}
  // 	}
  // }

  gridDisruptsPassability(
    blockingGrid: Grid.NumGrid,
    opts: Partial<DisruptsOptions> = {}
  ) {
    const walkableGrid = Grid.alloc(this.width, this.height);
    let disrupts = false;

    const gridOffsetX = opts.gridOffsetX || 0;
    const gridOffsetY = opts.gridOffsetY || 0;
    const bounds = opts.bounds || null;

    // Get all walkable locations after lake added
    this.cells.forEach((cell, i, j) => {
      if (bounds && !bounds.contains(i, j)) return; // outside bounds
      const blockingX = i + gridOffsetX;
      const blockingY = j + gridOffsetY;
      if (cell.isNull()) {
        return; // do nothing
      } else if (cell.canBePassed()) {
        if (
          blockingGrid.hasXY(blockingX, blockingY) &&
          blockingGrid[blockingX][blockingY]
        )
          return;
        walkableGrid[i][j] = 1;
      } else if (cell.hasTileFlag(TileFlags.T_HAS_STAIRS)) {
        if (
          blockingGrid.hasXY(blockingX, blockingY) &&
          blockingGrid[blockingX][blockingY]
        ) {
          disrupts = true;
        } else {
          walkableGrid[i][j] = 1;
        }
      }
    });

    let first = true;
    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
      for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
        if (walkableGrid[i][j] == 1) {
          if (first) {
            walkableGrid.floodFill(i, j, 1, 2);
            first = false;
          } else {
            disrupts = true;
          }
        }
      }
    }

    Grid.free(walkableGrid);
    return disrupts;
  }

  // FOV

  // Returns a boolean grid indicating whether each square is in the field of view of (xLoc, yLoc).
  // forbiddenTileFlags is the set of terrain flags that will block vision (but the blocking cell itself is
  // illuminated); forbiddenCellFlags is the set of map flags that will block vision.
  // If cautiousOnWalls is set, we will not illuminate blocking tiles unless the tile one space closer to the origin
  // is visible to the player; this is to prevent lights from illuminating a wall when the player is on the other
  // side of the wall.
  calcFov(
    grid: Grid.NumGrid,
    x: number,
    y: number,
    maxRadius: number,
    forbiddenCellFlags = 0,
    forbiddenTileFlags = TileFlags.T_OBSTRUCTS_VISION
  ) {
    maxRadius = maxRadius || this.width + this.height;
    grid.fill(0);
    const map = this;
    const FOV = new Fov.FOV({
      isBlocked(i, j) {
        return !!(
          !grid.hasXY(i, j) ||
          map.hasCellFlag(i, j, forbiddenCellFlags) ||
          map.hasTileFlag(i, j, forbiddenTileFlags)
        );
      },
      calcRadius(x: number, y: number) {
        return Math.sqrt(x ** 2 + y ** 2);
      },
      setVisible(x, y) {
        grid[x][y] = 1;
      },
      hasXY(x: number, y: number) {
        return grid.hasXY(x, y);
      },
    });
    return FOV.calculate(x, y, maxRadius);
  }

  losFromTo(a: Utils.XY, b: Utils.XY) {
    const line = Utils.getLine(a.x, a.y, b.x, b.y);
    if (!line || !line.length) return false;

    return !line.some((loc) => {
      return this.blocksVision(loc[0], loc[1]);
    });
  }

  // MEMORIES

  storeMemory(x: number, y: number) {
    const cell = this.cell(x, y);
    cell.storeMemory();
  }

  storeMemories() {
    let x, y;
    for (x = 0; x < this.width; ++x) {
      for (y = 0; y < this.height; ++y) {
        const cell = this.cell(x, y);
        if (cell.flags & CellFlags.ANY_KIND_OF_VISIBLE) {
          this.storeMemory(x, y);
        }
        cell.flags &= CellFlags.PERMANENT_CELL_FLAGS;
        cell.mechFlags &= CellMechFlags.PERMANENT_MECH_FLAGS;
      }
    }
  }

  // TICK

  async tick() {
    // map.debug("tick");
    this.forEach(
      (c) =>
        (c.mechFlags &= ~(
          CellMechFlags.EVENT_FIRED_THIS_TURN | CellMechFlags.EVENT_PROTECTED
        ))
    );
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        const cell = this.cells[x][y];
        await cell.activate("tick", { map: this, x, y, cell, safe: true });
      }
    }
    updateLiquid(this);
  }

  resetEvents() {
    this.forEach(
      (c) =>
        (c.mechFlags &= ~(
          CellMechFlags.EVENT_FIRED_THIS_TURN | CellMechFlags.EVENT_PROTECTED
        ))
    );
  }
}

export function make(w: number, h: number, floor: string, wall: string): Map;
export function make(w: number, h: number, floor: string): Map;
export function make(w: number, h: number, opts?: any): Map;
export function make(w: number, h: number, opts: any = {}, wall?: string) {
  if (typeof opts === "string") {
    opts = { tile: opts };
    if (wall) {
      opts.wall = wall;
    }
  }
  const map = new Map(w, h, opts);
  const floor = opts.tile || opts.floor || opts.floorTile;
  const boundary = opts.boundary || opts.wall || opts.wallTile;
  if (floor) {
    map.fill(floor, boundary);
  }
  if (!DATA.map) {
    DATA.map = map;
  }
  return map;
}

Make.map = make;

export function getCellAppearance(
  map: Map,
  x: number,
  y: number,
  dest: Canvas.Mixer
) {
  dest.blackOut();
  if (!map.hasXY(x, y)) return;
  const cell = map.cell(x, y);

  if (
    cell.isAnyKindOfVisible() &&
    cell.flags & (CellFlags.CELL_CHANGED | CellFlags.NEEDS_REDRAW)
  ) {
    Cell.getAppearance(cell, dest);
  } else if (cell.isRevealed()) {
    dest.drawSprite(cell.memory.mixer);
  }

  if (cell.isVisible()) {
    // keep here to allow for games that do not use fov to work
  } else if (!cell.isRevealed()) {
    dest.blackOut();
  } else if (!cell.isAnyKindOfVisible()) {
    dest.bg.mix(COLORS.black, 30);
    dest.fg.mix(COLORS.black, 30);
  }

  let needDistinctness = false;
  if (cell.flags & (CellFlags.IS_CURSOR | CellFlags.IS_IN_PATH)) {
    const highlight =
      cell.flags & CellFlags.IS_CURSOR ? COLORS.cursorColor : COLORS.yellow;
    if (cell.hasTileMechFlag(TileMechFlags.TM_INVERT_WHEN_HIGHLIGHTED)) {
      Color.swap(dest.fg, dest.bg);
    } else {
      // if (!GAME.trueColorMode || !dest.needDistinctness) {
      // dest.fg.mix(highlight, CONFIG.cursorPathIntensity || 20);
      // }
      dest.bg.mix(highlight, CONFIG.cursorPathIntensity || 20);
    }
    needDistinctness = true;
  }

  if (needDistinctness) {
    Color.separate(dest.fg, dest.bg);
  }

  // dest.bake();
}

export function addText(
  map: Map,
  x: number,
  y: number,
  text: string,
  fg: Color.ColorBase,
  bg: Color.ColorBase,
  layer?: TileLayer
) {
  for (let ch of text) {
    const sprite = Canvas.makeSprite(ch, fg, bg);
    const cell = map.cell(x++, y);
    cell.addSprite(sprite, layer || TileLayer.GROUND);
  }
}

export function updateGas(map: Map) {
  if (map.flags & Flags.MAP_NO_GAS) return;

  const newVolume = Grid.alloc(map.width, map.height);

  map.forEach((c, x, y) => {
    if (c.hasTileFlag(TileFlags.T_OBSTRUCTS_GAS)) return;

    let gas = c.gas;
    let highest = c.gasVolume;
    let sum = c.gasVolume;
    let count = 1;
    map.eachNeighbor(x, y, (n) => {
      if (n.hasTileFlag(TileFlags.T_OBSTRUCTS_GAS)) return;
      ++count;
      sum += n.gasVolume;
      if (n.gasVolume > highest) {
        gas = n.gas;
        highest = n.gasVolume;
      }
    });

    if (!sum) return;

    const newVol = Math.floor(sum / count);
    if (c.gas != gas) {
      c._setTile(gas, newVol, map); // volume = 1 to start, will change later
    }
    newVolume[x][y] += newVol;

    const rem = sum - count * Math.floor(sum / count);
    if (rem && random.number(count) < rem) {
      newVolume[x][y] += 1;
    }
    // disperses
    // if (newVolume[x][y] && random.chance(20)) {
    // 	newVolume[x][y] -= 1;
    // }
  });

  let hasGas = false;
  newVolume.forEach((v, i, j) => {
    const cell = map.cell(i, j);
    if (v) {
      hasGas = true;
      if (cell.gas && cell.gasVolume !== v) {
        cell.gasVolume = v;
        map.redrawCell(cell);
      }
    } else if (cell.gas) {
      cell.clearLayer(TileLayer.GAS);
      map.redrawCell(cell);
    }
  });

  if (hasGas) {
    map.flags &= ~Flags.MAP_NO_GAS;
  } else {
    map.flags |= Flags.MAP_NO_GAS;
  }
  map.changed(true);

  Grid.free(newVolume);
}

export function updateLiquid(map: Map) {
  if (map.flags & Flags.MAP_NO_LIQUID) return;

  const newVolume = Grid.alloc(map.width, map.height);

  map.forEach((c, x, y) => {
    if (c.hasTileFlag(TileFlags.T_OBSTRUCTS_LIQUID)) return;

    let liquid = c.liquid;
    let highest = c.liquidVolume;
    let count = 1;

    map.eachNeighbor(x, y, (n) => {
      if (n.hasTileFlag(TileFlags.T_OBSTRUCTS_LIQUID)) return;
      ++count;
      if (n.liquidVolume > highest) {
        liquid = n.liquid;
        highest = n.liquidVolume;
      }
    });

    let newVol = c.liquidVolume;
    if (newVol > 10 && count > 1) {
      let spread = Math.round(0.2 * c.liquidVolume);
      if (spread > 5) {
        newVol -= spread;
        if (c.liquid != liquid) {
          c._setTile(liquid, newVol, map); // volume = 1 to start, will change later
        }

        // spread = Math.floor(spread / count);
        if (spread) {
          newVolume.eachNeighbor(x, y, (v, i, j) => {
            newVolume[i][j] = v + spread;
          });
        }
      }
    }

    newVolume[x][y] += newVol;

    // disperses
    const tile = c.liquidTile;
    if (newVolume[x][y] > 0 && random.chance(tile.dissipate, 10000)) {
      newVolume[x][y] -= 1;
    }
  });

  let hasLiquid = false;
  newVolume.forEach((v, i, j) => {
    const cell = map.cell(i, j);
    if (v) {
      hasLiquid = true;
      if (cell.liquid && cell.liquidVolume !== v) {
        cell.liquidVolume = v;
        map.redrawCell(cell);
      }
    } else if (cell.liquid) {
      cell.clearLayer(TileLayer.LIQUID);
      map.redrawCell(cell);
    }
  });

  if (hasLiquid) {
    map.flags &= ~Flags.MAP_NO_LIQUID;
  } else {
    map.flags |= Flags.MAP_NO_LIQUID;
  }

  map.changed(true);

  Grid.free(newVolume);
}
