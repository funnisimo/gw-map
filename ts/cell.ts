import {
  color as Color,
  canvas as Canvas,
  utils as Utils,
  config as CONFIG,
  data as DATA,
  types as Types,
  random,
  make as Make,
} from "gw-utils";
import { Tile, tiles as TILES } from "./tile";
import * as Map from "./map";
import * as Activation from "./tileEvent";
import * as Light from "./light";
import * as Layer from "./layer";
import {
  Cell as Flags,
  CellMech as MechFlags,
  TileMech as TileMechFlags,
  Tile as TileFlags,
  Map as MapFlags,
  Layer as LayerFlags,
  Depth,
} from "./flags";

export { Flags, MechFlags };

// TODO - Move to gw-ui
Color.install("cursorColor", 25, 100, 150);
CONFIG.cursorPathIntensity = 50;

export class CellMemory {
  public mixer: Canvas.Mixer = new Canvas.Mixer();
  public item: Types.ItemType | null = null;
  public itemQuantity = 0;
  public actor: Types.ActorType | null = null;
  public tile: Tile | null = null;
  public cellFlags = 0;
  public cellMechFlags = 0;
  public layerFlags = 0;
  public tileFlags = 0;
  public tileMechFlags = 0;

  constructor() {}

  clear() {
    this.mixer.nullify();
    this.item = null;
    this.itemQuantity = 0;
    this.actor = null;
    this.tile = null;
    this.cellFlags = 0;
    this.cellMechFlags = 0;
    this.layerFlags = 0;
    this.tileFlags = 0;
    this.tileMechFlags = 0;
  }

  copy(other: CellMemory) {
    const mixer = this.mixer;
    Object.assign(this, other);
    this.mixer = mixer;
    this.mixer.copy(other.mixer);
  }
}

export type TileBase = Tile | string;

interface LayerItem {
  layer: Types.LayerType;
  next: LayerItem | null;
}

declare type LayerTile = Tile | null;

export class Cell implements Types.CellType {
  public _tiles: LayerTile[] = [];

  public layers: LayerItem | null = null;
  protected _actor: Types.ActorType | null = null;
  protected _item: Types.ItemType | null = null;
  public data: any = {};

  public flags: Flags = Flags.CELL_DEFAULT; // non-terrain cell flags
  public mechFlags: MechFlags = 0;
  public gasVolume = 0; // quantity of gas in cell
  public liquidVolume = 0;
  public machineNumber = 0;
  public memory: CellMemory = new CellMemory();

  public light: [number, number, number] = [100, 100, 100];
  public oldLight: [number, number, number] = [100, 100, 100];
  public glowLight: [number, number, number] = [100, 100, 100];

  constructor() {}

  copy(other: Cell) {
    Utils.copyObject(this, other);
  }

  clear() {
    for (let i = 0; i < this._tiles.length; ++i) {
      this._tiles[i] = null;
    }

    this.layers = null;
    this._actor = null;
    this._item = null;
    this.data = {};

    this.flags = Flags.CELL_DEFAULT; // non-terrain cell flags
    this.mechFlags = 0;
    this.gasVolume = 0; // quantity of gas in cell
    this.liquidVolume = 0;
    this.machineNumber = 0;
    this.memory.clear();

    this.light = [100, 100, 100];
    this.oldLight = [100, 100, 100];
    this.glowLight = [100, 100, 100];
  }

  clearLayers(nullLiquid = false, nullSurface = false, nullGas = false) {
    if (nullLiquid) {
      this._tiles[1] = null;
      this.liquidVolume = 0;
    }
    if (nullSurface) {
      this._tiles[2] = null;
    }
    if (nullGas) {
      this._tiles[3] = null;
      this.gasVolume = 0;
    }
    this.flags |= Flags.CELL_CHANGED;
  }

  get ground() {
    return this._tiles[Depth.GROUND]?.id || null;
  }
  get liquid() {
    return this._tiles[Depth.LIQUID]?.id || null;
  }
  get surface() {
    return this._tiles[Depth.SURFACE]?.id || null;
  }
  get gas() {
    return this._tiles[Depth.GAS]?.id || null;
  }

  get groundTile(): Tile {
    return this._tiles[Depth.GROUND] || TILES.NULL;
  }
  get liquidTile(): Tile {
    return this._tiles[Depth.LIQUID] || TILES.NULL;
  }
  get surfaceTile(): Tile {
    return this._tiles[Depth.SURFACE] || TILES.NULL;
  }
  get gasTile(): Tile {
    return this._tiles[Depth.GAS] || TILES.NULL;
  }

  dump(): string {
    if (this.actor) return this.actor.sprite.ch as string;
    if (this.item) return this.item.sprite.ch as string;

    for (let i = this._tiles.length - 1; i >= 0; --i) {
      if (!this._tiles[i]) continue;
      const tile = this._tiles[i] || TILES.NULL;
      if (tile.sprite.ch) return tile.sprite.ch as string;
    }
    return TILES.NULL.sprite.ch as string;
  }

  get changed() {
    return (this.flags & Flags.CELL_CHANGED) > 0;
  }
  set changed(v: boolean) {
    if (v) {
      this.flags |= Flags.CELL_CHANGED;
    } else {
      this.flags &= ~Flags.CELL_CHANGED;
    }
  }

  isVisible() {
    return this.flags & Flags.VISIBLE;
  }
  isAnyKindOfVisible() {
    return (
      this.flags & Flags.ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */
    );
  }
  isOrWasAnyKindOfVisible() {
    return (
      this.flags &
      Flags.IS_WAS_ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */
    );
  }
  isRevealed(orMapped = false): boolean {
    const flag = Flags.REVEALED | (orMapped ? Flags.MAGIC_MAPPED : 0);
    return (this.flags & flag) > 0;
  }
  listInSidebar(): boolean {
    return this.hasTileMechFlag(TileMechFlags.TM_LIST_IN_SIDEBAR, true);
  }

  get needsRedraw() {
    return (this.flags & Flags.NEEDS_REDRAW) > 0;
  }
  set needsRedraw(v: boolean) {
    if (v) {
      this.flags |= Flags.NEEDS_REDRAW;
    } else {
      this.flags &= ~Flags.NEEDS_REDRAW;
    }
  }

  // TODO - Use functions in LIGHT to check these on cell.light directly???
  hasVisibleLight() {
    return Light.intensity(this.light) > CONFIG.light.INTENSITY_DARK;
  } // TODO
  isDark(darkColor?: Color.Color | [number, number, number]) {
    const intensity = darkColor
      ? Light.intensity(darkColor)
      : CONFIG.light.INTENSITY_DARK;
    return Light.intensity(this.light) <= intensity;
  } // TODO

  get lightChanged() {
    return (this.flags & Flags.LIGHT_CHANGED) > 0;
  }

  set lightChanged(v: boolean) {
    if (v) {
      this.flags |= Flags.LIGHT_CHANGED | Flags.NEEDS_REDRAW;
    } else {
      this.flags &= ~Flags.LIGHT_CHANGED;
    }
  }

  tile(layer = Depth.GROUND) {
    return this._tiles[layer] || TILES.NULL;
  }

  *tiles(): Generator<Tile> {
    for (let tile of this._tiles) {
      if (tile) {
        yield tile;
      }
    }
  }

  layerFlags(limitToPlayerKnowledge = false) {
    if (limitToPlayerKnowledge && !this.isVisible()) {
      return this.memory.layerFlags;
    }
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.flags.layer;
    }
    return flags;
  }

  tileFlags(limitToPlayerKnowledge = false) {
    if (limitToPlayerKnowledge && !this.isVisible()) {
      return this.memory.tileFlags;
    }
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.flags.tile;
    }
    return flags;
  }

  tileMechFlags(limitToPlayerKnowledge = false) {
    if (limitToPlayerKnowledge && !this.isVisible()) {
      return this.memory.tileMechFlags;
    }
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.flags.tileMech;
    }
    return flags;
  }

  hasLayerFlag(flag: LayerFlags, limitToPlayerKnowledge = false) {
    const flags = this.layerFlags(limitToPlayerKnowledge);
    return !!(flag & flags);
  }

  hasAllLayerFlags(flag: LayerFlags, limitToPlayerKnowledge = false) {
    const flags = this.layerFlags(limitToPlayerKnowledge);
    return (flag & flags) === flag;
  }

  hasTileFlag(flagMask: TileFlags, limitToPlayerKnowledge = false) {
    const tileFlags = this.tileFlags(limitToPlayerKnowledge);
    return !!(flagMask & tileFlags);
  }

  hasAllTileFlags(flags: TileFlags, limitToPlayerKnowledge = false) {
    return (flags & this.tileFlags(limitToPlayerKnowledge)) === flags;
  }

  hasTileMechFlag(flagMask: TileMechFlags, limitToPlayerKnowledge = false) {
    const mechFlags = this.tileMechFlags(limitToPlayerKnowledge);
    return !!(flagMask & mechFlags);
  }

  hasAllTileMechFlags(flags: TileMechFlags, limitToPlayerKnowledge = false) {
    return (flags & this.tileMechFlags(limitToPlayerKnowledge)) === flags;
  }

  setFlags(cellFlag: Flags = 0, cellMechFlag: MechFlags = 0) {
    this.flags |= cellFlag;
    this.mechFlags |= cellMechFlag;
    // this.flags |= Flags.NEEDS_REDRAW;
  }

  clearFlags(cellFlag: Flags = 0, cellMechFlag: MechFlags = 0) {
    this.flags &= ~cellFlag;
    this.mechFlags &= ~cellMechFlag;
    // if ((~cellFlag) & Flags.NEEDS_REDRAW) {
    //   this.flags |= Flags.NEEDS_REDRAW;
    // }
  }

  hasFlag(flag: Flags, limitToPlayerKnowledge = false) {
    const flags =
      limitToPlayerKnowledge && !this.isAnyKindOfVisible()
        ? this.memory.cellFlags
        : this.flags;
    return (flag & flags) > 0;
  }

  hasMechFlag(flag: MechFlags, limitToPlayerKnowledge = false) {
    const flags =
      limitToPlayerKnowledge && !this.isAnyKindOfVisible()
        ? this.memory.cellMechFlags
        : this.mechFlags;
    return (flag & flags) > 0;
  }

  hasTile(tile: string | Tile) {
    let id: string;
    if (tile instanceof Tile) {
      id = tile.id;
    } else {
      id = tile;
    }
    return this._tiles.some((t) => t && t.id === id);
  }

  // hasTileInGroup(...groups) {
  //   if (groups.length == 1 && Array.isArray(groups[0])) {
  //     groups = groups[0];
  //   }
  //   return this.layers.some( (tileId) => {
  //     const tile = TILES[tileId] || TILES.NOTHING;
  //     return Utils.intersect(groups, tile.groups);
  //   });
  // }

  // promotedTileFlags() {
  //   return this.successorTileFlags("promote");
  // }

  // discoveredTileFlags() {
  //   return this.successorTileFlags("discover");
  // }

  // hasDiscoveredTileFlag(flag: number) {
  //   // if (!this.hasTileMechFlag(TM_IS_SECRET)) return false;
  //   return this.discoveredTileFlags() & flag;
  // }

  topmostTile(skipGas = false): Tile {
    let best = TILES.NULL;
    let bestPriority = -10000;
    for (
      let layer = Depth.GROUND;
      layer <= (skipGas ? Depth.LIQUID : Depth.GAS);
      ++layer
    ) {
      // @ts-ignore
      const tile = this._tiles[layer];
      if (!tile) continue;
      if (tile.priority > bestPriority) {
        best = tile;
        bestPriority = tile.priority;
      }
    }
    return best;
  }

  tileWithFlag(tileFlag: number) {
    for (let tile of this.tiles()) {
      if (tile.flags.tile & tileFlag) return tile;
    }
    return null;
  }

  tileWithMechFlag(mechFlag: number) {
    for (let tile of this.tiles()) {
      if (tile.flags.tileMech & mechFlag) return tile;
    }
    return null;
  }

  tileDesc() {
    return this.topmostTile().desc;
  }

  tileFlavor() {
    return this.topmostTile().flavor;
  }

  getName(opts = {}) {
    return this.topmostTile().getName(opts);
  }

  isClear(): boolean {
    return this.ground == null;
  }

  isEmpty(): boolean {
    return !(this._actor || this._item);
  }

  isMoveableNow(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    const layerFlags = useMemory
      ? this.memory.layerFlags
      : this.layerFlags(false);
    return (layerFlags & LayerFlags.L_BLOCKS_MOVE) === 0;
  }

  isWalkableNow(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    const layerFlags = useMemory
      ? this.memory.layerFlags
      : this.layerFlags(false);
    if (layerFlags & LayerFlags.L_BLOCKS_MOVE) return false;

    const tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    if (!(tileFlags & TileFlags.T_IS_DEEP_LIQUID)) return true;
    return (tileFlags & TileFlags.T_BRIDGE) > 0;
  }

  canBeWalked(limitToPlayerKnowledge = false): boolean {
    if (this.isWalkableNow(limitToPlayerKnowledge)) return true;
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    const layerFlags = useMemory
      ? this.memory.layerFlags
      : this.layerFlags(false);
    return (layerFlags & LayerFlags.L_SECRETLY_PASSABLE) > 0;
  }

  isWall(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
    return (layerFlags & LayerFlags.L_IS_WALL) === LayerFlags.L_IS_WALL;
  }

  isObstruction(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
    return !!(layerFlags & LayerFlags.L_BLOCKS_DIAGONAL);
  }

  isDoorway(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
    return (
      (layerFlags & LayerFlags.L_BLOCKS_VISION) > 0 &&
      (layerFlags & LayerFlags.L_BLOCKS_MOVE) === 0
    );
  }

  isSecretDoorway(limitToPlayerKnowledge = false): boolean {
    if (limitToPlayerKnowledge) return false;
    const layerFlags = this.layerFlags(limitToPlayerKnowledge);
    return (layerFlags & LayerFlags.L_SECRETLY_PASSABLE) > 0;
  }

  blocksPathing(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    if (!this.isWalkableNow(limitToPlayerKnowledge)) return true;
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_PATHING_BLOCKER);
  }

  blocksVision(): boolean {
    const layerFlags = this.layerFlags();
    return !!(layerFlags & LayerFlags.L_BLOCKS_VISION);
  }

  isLiquid(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_IS_DEEP_LIQUID);
  }

  // TODO - Should this look at the tiles instead of the flags?
  // What if a gas tile is not set with T_GAS?
  // Should we force T_GAS if layer === GAS when creating a tile?
  hasGas(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_GAS);
  }

  markRevealed() {
    this.flags &= ~Flags.STABLE_MEMORY;
    if (this.flags & Flags.REVEALED) return false;

    this.flags |= Flags.REVEALED;
    return !this.isWall();
  }

  obstructsLayer(depth: Depth) {
    return (
      depth === Depth.SURFACE && this.hasLayerFlag(LayerFlags.L_BLOCKS_SURFACE)
    );
  }

  setTile(tileId: TileBase | null = null, volume = 0, map?: Map.Map) {
    map = map || DATA.map;
    let tile;
    if (tileId === null) {
      tile = TILES.NULL;
      tileId = null;
    } else if (typeof tileId === "string") {
      tile = TILES[tileId];
    } else if (tileId instanceof Tile) {
      tile = tileId;
      tileId = tile.id;
    }

    if (!tile) {
      return Utils.ERROR("Unknown tile - " + tileId);
    }

    if (tile.depth > 0 && !this._tiles[0]) {
      this.setTile(tile.defaultGround || TILES.FLOOR, 0, map); // TODO - do not use FLOOR?  Does map have the tile to use?
    }

    const oldTile = this._tiles[tile.depth] || TILES.NULL;
    const oldTileId = oldTile === TILES.NULL ? null : oldTile.id;

    if (oldTile.blocksPathing() != tile.blocksPathing()) {
      DATA.staleLoopMap = true;
    }

    if (
      tile.flags.tile & TileFlags.T_IS_FIRE &&
      !(oldTile.flags.tile & TileFlags.T_IS_FIRE)
    ) {
      this.mechFlags |= MechFlags.CAUGHT_FIRE_THIS_TURN;
    }

    const blocksVision = tile.flags.layer & LayerFlags.L_BLOCKS_VISION;
    const oldBlocksVision = oldTile.flags.layer & LayerFlags.L_BLOCKS_VISION;
    if (map && this.isAnyKindOfVisible() && blocksVision != oldBlocksVision) {
      map.setFlag(MapFlags.MAP_FOV_CHANGED);
    }

    if (oldTileId !== null) this.removeLayer(oldTile);
    this._tiles[tile.depth] = tileId === null ? null : tile;
    if (tileId !== null) this.addLayer(tile);

    if (tile.depth == Depth.LIQUID) {
      this.liquidVolume =
        volume + (tileId == oldTileId ? this.liquidVolume : 0);
      if (map) map.clearFlag(MapFlags.MAP_NO_LIQUID);
    } else if (tile.depth == Depth.GAS) {
      this.gasVolume = volume + (tileId == oldTileId ? this.gasVolume : 0);
      if (map) map.clearFlag(MapFlags.MAP_NO_GAS);
    }

    // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    this.flags |= Flags.CELL_CHANGED | Flags.NEEDS_REDRAW;
    if (map && oldTile.light !== tile.light) {
      map.clearFlag(
        MapFlags.MAP_STABLE_GLOW_LIGHTS | MapFlags.MAP_STABLE_LIGHTS
      );
    }
    return true;
  }

  clearLayer(depth: Depth) {
    // @ts-ignore
    if (typeof depth === "string") depth = Layer[depth];

    const current = this._tiles[depth];
    if (current) {
      // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
      this.flags |= Flags.CELL_CHANGED;
      this.removeLayer(current);
    }
    this._tiles[depth] = null;
    if (depth == Depth.LIQUID) {
      this.liquidVolume = 0;
    } else if (depth == Depth.GAS) {
      this.gasVolume = 0;
    }
  }

  clearLayersExcept(except: Depth = Depth.GROUND, ground?: string | null) {
    const floorTile = ground ? TILES[ground] : this.groundTile;
    for (let layer = 0; layer < this._tiles.length; layer++) {
      if (layer != except && layer != Depth.GAS) {
        if (layer === Depth.GROUND) {
          if (floorTile !== this.groundTile) this.setTile(floorTile);
        } else {
          this.clearLayer(layer);
        }
      }
    }
    // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    this.flags |= Flags.CELL_CHANGED;
  }

  clearLayersWithFlags(tileFlags: number, tileMechFlags = 0) {
    for (let i = 0; i < this._tiles.length; ++i) {
      const tile = this._tiles[i];
      if (!tile) continue;
      if (tileFlags && tileMechFlags) {
        if (
          tile.flags.tile & tileFlags &&
          tile.flags.tileMech & tileMechFlags
        ) {
          this.clearLayer(i);
        }
      } else if (tileFlags) {
        if (tile.flags.tile & tileFlags) {
          this.clearLayer(i);
        }
      } else if (tileMechFlags) {
        if (tile.flags.tileMech & tileMechFlags) {
          this.clearLayer(i);
        }
      }
    }
    // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
  }

  // EVENTS

  async activate(name: string, ctx: any = {}) {
    ctx.cell = this;
    let fired = false;
    // cell.debug("fire event - %s", name);
    for (let tile of this.tiles()) {
      if (!tile.activates) continue;
      const ev = tile.activates[name];
      if (ev) {
        // cell.debug(" - has event");
        if (ev.chance && !random.chance(ev.chance, 10000)) {
          continue;
        }

        ctx.tile = tile;
        // cell.debug(" - spawn event @%d,%d - %s", ctx.x, ctx.y, name);
        fired = (await Activation.spawn(ev, ctx)) || fired;
        // cell.debug(" - spawned");
        if (fired) {
          break;
        }
      }
    }
    if (fired) {
      // this.mechFlags |= MechFlags.EVENT_FIRED_THIS_TURN;
    }
    return fired;
  }

  activatesOn(name: string) {
    for (let tile of this.tiles()) {
      if (tile.activatesOn(name)) return true;
    }
    return false;
  }

  // ITEM
  get item() {
    return this._item;
  }

  set item(item: Types.ItemType | null) {
    if (this.item) {
      this.removeLayer(this.item);
    }
    this._item = item;
    if (item) {
      this.flags |= Flags.HAS_ITEM;
      this.addLayer(item);
    } else {
      this.flags &= ~Flags.HAS_ITEM;
    }
  }

  // ACTOR
  get actor() {
    return this._actor;
  }

  set actor(actor: Types.ActorType | null) {
    if (this.actor) {
      this.removeLayer(this.actor);
    }
    this._actor = actor;
    if (actor) {
      this.flags |= Flags.HAS_ACTOR;
      this.addLayer(actor);
    } else {
      this.flags &= ~Flags.HAS_ACTOR;
    }
  }

  addLayer(layer: Types.LayerType) {
    if (!layer) return;

    // this.flags |= Flags.NEEDS_REDRAW;
    this.flags |= Flags.CELL_CHANGED;
    let current = this.layers;

    if (
      !current ||
      current.layer.depth > layer.depth ||
      (current.layer.depth == layer.depth &&
        current.layer.priority > layer.priority)
    ) {
      this.layers = {
        layer,
        next: current,
      };
      return;
    }

    while (
      current.next &&
      (current.layer.depth < layer.depth ||
        (current.layer.depth == layer.depth &&
          current.layer.priority <= layer.priority))
    ) {
      current = current.next;
    }

    const item = {
      layer,
      next: current.next,
    };
    current.next = item;
  }

  removeLayer(layer: Types.LayerType) {
    if (!layer) return false;
    if (!this.layers) return false;

    // this.flags |= Flags.NEEDS_REDRAW;
    this.flags |= Flags.CELL_CHANGED;

    if (this.layers && this.layers.layer === layer) {
      this.layers = this.layers.next;
      return true;
    }

    let prev = this.layers;
    let current = this.layers.next;
    while (current) {
      if (current.layer === layer) {
        prev.next = current.next;
        return true;
      }
      prev = current;
      current = current.next;
    }
    return false;
  }

  // MEMORY

  storeMemory() {
    const memory = this.memory;
    memory.tileFlags = this.tileFlags();
    memory.tileMechFlags = this.tileMechFlags();
    memory.layerFlags = this.layerFlags();
    memory.cellFlags = this.flags;
    memory.cellMechFlags = this.mechFlags;
    memory.tile = this.topmostTile();
    if (this.item) {
      memory.item = this.item;
      memory.itemQuantity = this.item.quantity;
    } else {
      memory.item = null;
      memory.itemQuantity = 0;
    }
    memory.actor = this.actor;
    getAppearance(this, memory.mixer);

    if (this.actor && this.isOrWasAnyKindOfVisible()) {
      if (this.actor.rememberedInCell && this.actor.rememberedInCell !== this) {
        // console.log("remembered in cell change");
        this.actor.rememberedInCell.storeMemory();
        this.actor.rememberedInCell.flags |= Flags.NEEDS_REDRAW;
      }
      this.actor.rememberedInCell = this;
    }
  }
}

export function make(tile?: string) {
  const cell = new Cell();
  if (tile) {
    cell.setTile(tile);
  }
  return cell;
}

Make.cell = make;

export function getAppearance(cell: Cell, dest: Canvas.Mixer) {
  const memory = cell.memory.mixer;
  memory.blackOut();

  let needDistinctness =
    cell.tileMechFlags() & TileMechFlags.TM_VISUALLY_DISTINCT;

  let current = cell.layers;
  while (current) {
    const layer = current.layer;
    let alpha = layer.sprite.opacity || 100;
    if (layer.depth == Depth.LIQUID) {
      alpha = Utils.clamp(cell.liquidVolume || 0, 20, 100);
    } else if (layer.depth == Depth.GAS) {
      alpha = Utils.clamp(cell.gasVolume || 0, 20, 100);
    }
    memory.drawSprite(layer.sprite, alpha);
    current = current.next;
  }

  memory.fg.multiply(cell.light);
  memory.bg.multiply(cell.light);
  memory.bake(!cell.isAnyKindOfVisible()); // turns off dancing if not visible
  if (needDistinctness) {
    Color.separate(memory.fg, memory.bg);
  }
  dest.drawSprite(memory);
  return true;
}
