import {
  utils as Utils,
  random,
  grid as Grid,
  events as Events,
  color as Color,
  flag as Flag,
  data as Data,
  types as Types,
  message as Msg,
  make as Make,
} from "gw-utils";

import {
  Depth,
  Activation as Flags,
  Tile as TileFlags,
  CellMech as CellMechFlags,
  Layer as LayerFlags,
} from "./flags";

import * as Tile from "./tile";
import * as Cell from "./cell";
import * as Map from "./map";

export { Flags };

export class TileEvent {
  public tile: string | null;
  public fn: Function | null;
  public item: string | null;
  public message: string | null;
  public lightFlare: string | null;
  public flashColor: Color.Color | null;
  public messageDisplayed: boolean;
  public emit: string | null;

  public chance: number;
  public volume: number;
  public spread: number;
  public radius: number;
  public decrement: number;
  public flags: number;
  public matchTile: string | null;

  public next: string | null;

  public id: string | null;

  constructor(opts: any = {}) {
    if (typeof opts === "function") {
      opts = {
        fn: opts,
      };
    }

    this.tile = opts.tile || null;
    this.fn = opts.fn || null;
    this.item = opts.item || null;
    this.chance = opts.chance || 0;
    this.volume = opts.volume || 0;

    // spawning pattern:
    this.spread = opts.spread || 0;
    this.radius = opts.radius || 0;
    this.decrement = opts.decrement || 0;
    this.flags = Flag.from(Flags, opts.flags);
    this.matchTile = opts.matchTile || opts.needs || 0; /* ENUM tileType */
    this.next = opts.next || null; /* ENUM makeEventTypes */

    this.message = opts.message || null;
    this.lightFlare = opts.flare || null;
    this.flashColor = opts.flash ? Color.from(opts.flash) : null;
    // this.effectRadius = radius || 0;
    this.messageDisplayed = false;
    this.emit = opts.emit || null; // name of the event to emit when activated
    this.id = opts.id || null;
  }
}

export function make(opts: string | any) {
  if (!opts) return null;
  if (typeof opts === "string") {
    opts = { tile: opts };
  }
  const te = new TileEvent(opts);
  return te;
}

Make.tileEvent = make;

export const activations: Record<string, TileEvent | null> = {
  DF_NONE: null,
};

export function install(id: string, event: TileEvent | any) {
  if (!(event instanceof TileEvent)) {
    event = make(event);
  }
  activations[id] = event;
  if (event) event.id = id;
  return event;
}

export function resetAllMessages() {
  Object.values(activations).forEach((f) => {
    if (f instanceof TileEvent) {
      f.messageDisplayed = false;
    }
  });
}

// returns whether the feature was successfully generated (false if we aborted because of blocking)
export async function spawn(
  activation: TileEvent | Function | string,
  ctx: any = {}
): Promise<boolean> {
  let i, j;

  if (!activation) return false;
  if (!ctx) return false;

  let feat: TileEvent;
  if (typeof activation === "string") {
    // @ts-ignore
    feat = activations[activation];
    if (!feat) Utils.ERROR("Unknown tile Event: " + activation);
  } else if (typeof activation === "function") {
    return activation(ctx);
  } else {
    feat = activation;
  }

  const map = ctx.map;
  const x = ctx.x;
  const y = ctx.y;

  if (!map || x === undefined || y === undefined) {
    Utils.ERROR("MAP, x, y are required in context.");
  }

  if (
    ctx.safe &&
    map.hasCellMechFlag(x, y, CellMechFlags.EVENT_FIRED_THIS_TURN)
  ) {
    if (!(feat.flags & Flags.DFF_ALWAYS_FIRE)) {
      // Activation.debug('spawn - already fired.');
      return false;
    }
  }

  // Activation.debug('spawn', x, y, 'id=', feat.id, 'tile=', feat.tile, 'item=', feat.item);

  ctx.refreshCell = ctx.refreshCell || !(feat.flags & Flags.DFF_NO_REDRAW_CELL);
  const abortIfBlocking = (ctx.abortIfBlocking =
    ctx.abortIfBlocking || feat.flags & Flags.DFF_ABORT_IF_BLOCKS_MAP);

  // if ((feat.flags & DFF_RESURRECT_ALLY) && !resurrectAlly(x, y))
  // {
  //     return false;
  // }

  if (
    feat.message &&
    feat.message.length &&
    !feat.messageDisplayed &&
    map.isVisible(x, y)
  ) {
    feat.messageDisplayed = true;
    Msg.add(feat.message);
  }

  let tile: Tile.Tile | null = null;
  if (feat.tile) {
    tile = Tile.tiles[feat.tile] || null;
    if (!tile) {
      Utils.ERROR("Unknown tile: " + feat.tile);
    }
  }

  let item: Types.ItemType | null = null;
  if (feat.item && "item" in Make) {
    item = Make.item(feat.item);
    if (!item) {
      Utils.ERROR("Unknown item: " + feat.item);
    }
  }

  // Blocking keeps track of whether to abort if it turns out that the DF would obstruct the level.
  const blocking = (ctx.blocking =
    abortIfBlocking &&
    !(feat.flags & Flags.DFF_PERMIT_BLOCKING) &&
    ((tile && tile.blocksPathing()) ||
      (item && item.blocksMove()) ||
      feat.flags & Flags.DFF_TREAT_AS_BLOCKING)
      ? true
      : false);

  // Activation.debug('- blocking', blocking);

  const spawnMap = Grid.alloc(map.width, map.height);

  let didSomething = false;
  computeSpawnMap(feat, spawnMap, ctx);
  if (
    !blocking ||
    !map.gridDisruptsPassability(spawnMap, { bounds: ctx.bounds })
  ) {
    if (feat.flags & Flags.DFF_EVACUATE_CREATURES) {
      // first, evacuate creatures, so that they do not re-trigger the tile.
      if (evacuateCreatures(map, spawnMap)) {
        didSomething = true;
      }
    }

    if (feat.flags & Flags.DFF_EVACUATE_ITEMS) {
      // first, evacuate items, so that they do not re-trigger the tile.
      if (evacuateItems(map, spawnMap)) {
        didSomething = true;
      }
    }

    if (feat.flags & Flags.DFF_NULLIFY_CELL) {
      // first, clear other tiles (not base/ground)
      if (nullifyCells(map, spawnMap, feat.flags)) {
        didSomething = true;
      }
    }

    if (tile || item || feat.fn) {
      if (await spawnTiles(feat, spawnMap, ctx, tile, item)) {
        didSomething = true;
      }
    }
  }

  if (item) {
    item.delete();
  }

  if (didSomething && feat.flags & Flags.DFF_PROTECTED) {
    spawnMap.forEach((v, i, j) => {
      if (!v) return;
      const cell = map.cell(i, j);
      cell.mechFlags |= CellMechFlags.EVENT_PROTECTED;
    });
  }

  if (didSomething) {
    // if ((feat.flags & Flags.DFF_AGGRAVATES_MONSTERS) && feat.effectRadius) {
    //     await aggravateMonsters(feat.effectRadius, x, y, /* Color. */gray);
    // }
    // if (refreshCell && feat.flashColor && feat.effectRadius) {
    //     await colorFlash(feat.flashColor, 0, (IN_FOV | CLAIRVOYANT_VISIBLE), 4, feat.effectRadius, x, y);
    // }
    // if (refreshCell && feat.lightFlare) {
    //     createFlare(x, y, feat.lightFlare);
    // }
  }

  // if (refreshCell && feat.tile
  // 	&& (tile.flags & (TileFlags.T_IS_FIRE | TileFlags.T_AUTO_DESCENT))
  // 	&& map.hasTileFlag(PLAYER.xLoc, PLAYER.yLoc, (TileFlags.T_IS_FIRE | TileFlags.T_AUTO_DESCENT)))
  // {
  // 	await applyInstantTileEffectsToCreature(PLAYER);
  // }

  // apply tile effects
  if (didSomething) {
    for (let i = 0; i < spawnMap.width; ++i) {
      for (let j = 0; j < spawnMap.height; ++j) {
        const v = spawnMap[i][j];
        if (!v || Data.gameHasEnded) continue;
        const cell = map.cell(i, j);
        if (cell.actor || cell.item) {
          for (let t of cell.tiles()) {
            await t.applyInstantEffects(map, i, j, cell);
            if (Data.gameHasEnded) {
              return true;
            }
          }
        }
      }
    }
  }

  if (feat.emit) {
    await Events.emit(feat.emit, ctx);
    didSomething = true;
  }

  if (Data.gameHasEnded) {
    Grid.free(spawnMap);
    return didSomething;
  }

  //	if (succeeded && feat.message[0] && !feat.messageDisplayed && isVisible(x, y)) {
  //		feat.messageDisplayed = true;
  //		message(feat.message, false);
  //	}
  if (feat.next && (didSomething || feat.flags & Flags.DFF_SUBSEQ_ALWAYS)) {
    // Activation.debug('- subsequent: %s, everywhere=%s', feat.next, feat.flags & Flags.DFF_SUBSEQ_EVERYWHERE);
    if (feat.flags & Flags.DFF_SUBSEQ_EVERYWHERE) {
      for (i = 0; i < map.width; i++) {
        for (j = 0; j < map.height; j++) {
          if (spawnMap[i][j]) {
            ctx.x = i;
            ctx.y = j;
            await spawn(feat.next, ctx);
          }
        }
      }
      ctx.x = x;
      ctx.y = y;
    } else {
      await spawn(feat.next, ctx);
    }
  }
  if (didSomething) {
    if (
      tile &&
      tile.flags.tile &
        (TileFlags.T_DEEP_WATER | TileFlags.T_LAVA | TileFlags.T_AUTO_DESCENT)
    ) {
      Data.updateMapToShoreThisTurn = false;
    }

    // awaken dormant creatures?
    // if (feat.flags & Flags.DFF_ACTIVATE_DORMANT_MONSTER) {
    //     for (monst of map.dormant) {
    //         if (monst.x == x && monst.y == y || spawnMap[monst.x][monst.y]) {
    //             // found it!
    //             toggleMonsterDormancy(monst);
    //         }
    //     }
    // }
  }

  if (didSomething) {
    spawnMap.forEach((v, i, j) => {
      if (v) map.redrawXY(i, j);
    });

    map.changed = true;

    if (!(feat.flags & Flags.DFF_NO_MARK_FIRED)) {
      spawnMap.forEach((v, i, j) => {
        if (v) {
          map.setCellFlags(i, j, 0, CellMechFlags.EVENT_FIRED_THIS_TURN);
        }
      });
    }
  }

  // Activation.debug('- spawn complete : @%d,%d, ok=%s, feat=%s', ctx.x, ctx.y, didSomething, feat.id);

  Grid.free(spawnMap);
  return didSomething;
}

function cellIsOk(feat: TileEvent, x: number, y: number, ctx: any = {}) {
  const map = ctx.map;
  if (!map.hasXY(x, y)) return false;
  const cell = map.cell(x, y);

  if (feat.flags & Flags.DFF_BUILD_IN_WALLS) {
    if (!cell.isWall()) return false;
  } else if (feat.flags & Flags.DFF_MUST_TOUCH_WALLS) {
    let ok = false;
    map.eachNeighbor(x, y, (c: Cell.Cell) => {
      if (c.isWall()) {
        ok = true;
      }
    });
    if (!ok) return false;
  } else if (feat.flags & Flags.DFF_NO_TOUCH_WALLS) {
    let ok = true;
    map.eachNeighbor(x, y, (c: Cell.Cell) => {
      if (c.isWall()) {
        ok = false;
      }
    });
    if (!ok) return false;
  }

  if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
  if (feat.matchTile && !cell.hasTile(feat.matchTile)) return false;
  if (
    cell.hasLayerFlag(LayerFlags.L_BLOCKS_EFFECTS) &&
    !feat.matchTile &&
    (ctx.x != x || ctx.y != y)
  )
    return false;

  return true;
}

export function computeSpawnMap(
  feat: TileEvent,
  spawnMap: Grid.NumGrid,
  ctx: any = {}
) {
  let i, j, dir, t, x2, y2;
  let madeChange;

  const map = ctx.map;
  const x = ctx.x;
  const y = ctx.y;
  const bounds = ctx.bounds || null;

  if (bounds) {
    // Activation.debug('- bounds', bounds);
  }

  let startProb = feat.spread || 0;
  let probDec = feat.decrement || 0;

  if (feat.matchTile && typeof feat.matchTile === "string") {
    const name = feat.matchTile;
    const tile = Tile.tiles[name];
    if (!tile) {
      Utils.ERROR("Failed to find match tile with name:" + name);
    }
    feat.matchTile = tile.id;
  }

  spawnMap[x][y] = t = 1; // incremented before anything else happens

  let radius = feat.radius || 0;
  if (feat.flags & Flags.DFF_SPREAD_CIRCLE) {
    radius = 0;
    startProb = startProb || 100;
    if (startProb >= 100) {
      probDec = probDec || 100;
    }
    while (random.chance(startProb)) {
      startProb -= probDec;
      ++radius;
    }
    startProb = 100;
    probDec = 0;
  }

  if (radius) {
    startProb = startProb || 100;
    spawnMap.updateCircle(x, y, radius, (_v, i, j) => {
      if (!cellIsOk(feat, i, j, ctx)) return 0;

      const dist = Math.floor(Utils.distanceBetween(x, y, i, j));
      const prob = startProb - dist * probDec;
      if (!random.chance(prob)) return 0;
      return 1;
    });
    spawnMap[x][y] = 1;
  } else if (startProb) {
    madeChange = true;
    if (startProb >= 100) {
      probDec = probDec || 100;
    }

    if (feat.flags & Flags.DFF_SPREAD_LINE) {
      x2 = x;
      y2 = y;
      const dir = Utils.DIRS[random.number(4)];
      while (madeChange) {
        madeChange = false;
        x2 = x2 + dir[0];
        y2 = y2 + dir[1];
        if (
          spawnMap.hasXY(x2, y2) &&
          !spawnMap[x2][y2] &&
          cellIsOk(feat, x2, y2, ctx) &&
          random.chance(startProb)
        ) {
          spawnMap[x2][y2] = 1;
          madeChange = true;
          startProb -= probDec;
        }
      }
    } else {
      if (probDec <= 0) probDec = startProb;
      while (madeChange && startProb > 0) {
        madeChange = false;
        t++;
        for (i = 0; i < map.width; i++) {
          for (j = 0; j < map.height; j++) {
            if (spawnMap[i][j] == t - 1) {
              for (dir = 0; dir < 4; dir++) {
                x2 = i + Utils.DIRS[dir][0];
                y2 = j + Utils.DIRS[dir][1];
                if (
                  spawnMap.hasXY(x2, y2) &&
                  !spawnMap[x2][y2] &&
                  cellIsOk(feat, x2, y2, ctx) &&
                  random.chance(startProb)
                ) {
                  spawnMap[x2][y2] = t;
                  madeChange = true;
                }
              }
            }
          }
        }
        startProb -= probDec;
      }
    }
  }

  if (!cellIsOk(feat, x, y, ctx)) {
    spawnMap[x][y] = 0;
  }
}

export async function spawnTiles(
  feat: TileEvent,
  spawnMap: Grid.NumGrid,
  ctx: any,
  tile?: Tile.Tile | null,
  item?: Types.ItemType | null
) {
  let i, j;
  let accomplishedSomething;

  accomplishedSomething = false;

  const blockedByOtherLayers = feat.flags & Flags.DFF_BLOCKED_BY_OTHER_LAYERS;
  const superpriority = feat.flags & Flags.DFF_SUPERPRIORITY;
  const applyEffects = ctx.refreshCell;
  const map: Map.Map = ctx.map;
  const volume = ctx.volume || feat.volume || 0; // (tile ? tile.volume : 0);

  for (i = 0; i < spawnMap.width; i++) {
    for (j = 0; j < spawnMap.height; j++) {
      if (!spawnMap[i][j]) continue; // If it's not flagged for building in the spawn map,
      spawnMap[i][j] = 0; // so that the spawnmap reflects what actually got built

      const cell = map.cell(i, j);
      if (cell.mechFlags & CellMechFlags.EVENT_PROTECTED) continue;

      if (tile) {
        if (cell.tile(tile.depth) === tile) {
          // If the new cell does not already contains the fill terrain,
          if (tile.depth == Depth.GAS) {
            spawnMap[i][j] = 1;
            cell.gasVolume += volume;
          } else if (tile.depth == Depth.LIQUID) {
            spawnMap[i][j] = 1;
            cell.liquidVolume += volume;
          }
        } else if (
          (superpriority || cell.tile(tile.depth).priority < tile.priority) && // If the terrain in the layer to be overwritten has a higher priority number (unless superpriority),
          !cell.obstructsLayer(tile.depth) && // If we will be painting into the surface layer when that cell forbids it,
          (!cell.item || !(feat.flags & Flags.DFF_BLOCKED_BY_ITEMS)) &&
          (!cell.actor || !(feat.flags & Flags.DFF_BLOCKED_BY_ACTORS)) &&
          (!blockedByOtherLayers || cell.topmostTile().priority < tile.priority)
        ) {
          // if the fill won't violate the priority of the most important terrain in this cell:
          spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built

          map.setTile(i, j, tile, volume);
          // map.redrawCell(cell);
          // if (volume && cell.gas) {
          //     cell.volume += (feat.volume || 0);
          // }

          // debug('- tile', i, j, 'tile=', tile.id);

          // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
          accomplishedSomething = true;
        }
      }

      if (item) {
        if (superpriority || !cell.item) {
          if (!cell.hasLayerFlag(LayerFlags.L_BLOCKS_ITEMS)) {
            spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
            if (cell.item) {
              map.removeItem(cell.item);
            }
            const clone = item.clone();
            map.addItem(i, j, clone);
            // map.redrawCell(cell);
            // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
            accomplishedSomething = true;
            // Activation.debug('- item', i, j, 'item=', itemKind.id);
          }
        }
      }

      if (feat.fn) {
        ctx.spawnMap = spawnMap;
        if (await feat.fn(i, j, ctx)) {
          spawnMap[i][j] = 1; // so that the spawnmap reflects what actually got built
          // map.redrawCell(cell);
          // cell.mechFlags |= CellMechFlags.EVENT_FIRED_THIS_TURN;
          accomplishedSomething = true;
        }
      }

      if (applyEffects) {
        // if (PLAYER.xLoc == i && PLAYER.yLoc == j && !PLAYER.status.levitating && refresh) {
        // 	flavorMessage(tileFlavor(PLAYER.xLoc, PLAYER.yLoc));
        // }
        // if (cell.actor || cell.item) {
        // 	for(let t of cell.tiles()) {
        // 		await t.applyInstantEffects(map, i, j, cell);
        // 		if (Data.gameHasEnded) {
        // 			return true;
        // 		}
        // 	}
        // }
        // if (tile.flags & TileFlags.T_IS_FIRE) {
        // 	if (cell.flags & CellFlags.HAS_ITEM) {
        // 		theItem = map.itemAt(i, j);
        // 		if (theItem.flags & Flags.Item.ITEM_FLAMMABLE) {
        // 			await burnItem(theItem);
        // 		}
        // 	}
        // }
      }
    }
  }
  if (accomplishedSomething) {
    map.changed = true;
  }
  return accomplishedSomething;
}

export function nullifyCells(
  map: Map.Map,
  spawnMap: Grid.NumGrid,
  flags: number
) {
  let didSomething = false;
  const nullSurface = flags & Flags.DFF_NULL_SURFACE;
  const nullLiquid = flags & Flags.DFF_NULL_LIQUID;
  const nullGas = flags & Flags.DFF_NULL_GAS;
  spawnMap.forEach((v, i, j) => {
    if (!v) return;
    map.clearCellLayers(i, j, !!nullLiquid, !!nullSurface, !!nullGas);
    didSomething = true;
  });
  return didSomething;
}

export function evacuateCreatures(map: Map.Map, blockingMap: Grid.NumGrid) {
  let i, j;

  let didSomething = false;
  for (i = 0; i < map.width; i++) {
    for (j = 0; j < map.height; j++) {
      if (!blockingMap[i][j]) continue;
      const cell = map.cell(i, j);
      if (!cell.actor) continue;
      const monst = cell.actor;
      const loc = map.matchingLocNear(
        i,
        j,
        (cell: Cell.Cell) => {
          return !monst.forbidsCell(cell);
        },
        { hallways: true, blockingMap }
      );
      if (loc && loc[0] >= 0 && loc[1] >= 0) {
        map.moveActor(loc[0], loc[1], monst);
        // map.redrawXY(loc[0], loc[1]);
        didSomething = true;
      }
    }
  }
  return didSomething;
}

export function evacuateItems(map: Map.Map, blockingMap: Grid.NumGrid) {
  let didSomething = false;
  blockingMap.forEach((v: number, i: number, j: number) => {
    if (!v) return;
    const cell = map.cell(i, j);
    if (!cell.item) return;

    const item: Types.ItemType = cell.item;
    const loc = map.matchingLocNear(
      i,
      j,
      (dest: Cell.Cell) => {
        return !item.forbidsCell(dest);
      },
      { hallways: true, blockingMap }
    );
    if (loc && loc[0] >= 0 && loc[1] >= 0) {
      map.removeItem(item);
      map.addItem(loc[0], loc[1], item);
      // map.redrawXY(loc[0], loc[1]);
      didSomething = true;
    }
  });
  return didSomething;
}
