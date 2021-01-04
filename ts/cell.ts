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
import { Tile, tiles as TILES, Layer } from "./tile";
import * as Map from "./map";
import * as Activation from "./tileEvent";
import * as Light from "./light";
import {
  Cell as Flags,
  CellMech as MechFlags,
  TileMech as TileMechFlags,
  Tile as TileFlags,
  Map as MapFlags,
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
  public tileFlags = 0;
  public tileMechFlags = 0;

  constructor() {}

  nullify() {
    this.mixer.nullify();
    this.item = null;
    this.itemQuantity = 0;
    this.actor = null;
    this.tile = null;
    this.cellFlags = 0;
    this.cellMechFlags = 0;
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

interface SpriteData {
  layer: Layer;
  priority: number;
  sprite: Canvas.SpriteType;
  next: SpriteData | null;
}

declare type LayerTile = Tile | null;

export class Cell implements Types.CellType {
  public layers: LayerTile[] = [];

  public sprites: SpriteData | null = null;
  protected _actor: Types.ActorType | null = null;
  protected _item: Types.ItemType | null = null;
  public data: any = {};

  public flags: number = Flags.CELL_DEFAULT; // non-terrain cell flags
  public mechFlags = 0;
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

  nullify() {
    for (let i = 0; i < this.layers.length; ++i) {
      this.layers[i] = null;
    }

    this.sprites = null;
    this._actor = null;
    this._item = null;
    this.data = {};

    this.flags = Flags.CELL_DEFAULT; // non-terrain cell flags
    this.mechFlags = 0;
    this.gasVolume = 0; // quantity of gas in cell
    this.liquidVolume = 0;
    this.machineNumber = 0;
    this.memory.nullify();

    this.light = [100, 100, 100];
    this.oldLight = [100, 100, 100];
    this.glowLight = [100, 100, 100];
  }

  nullifyLayers(nullLiquid = false, nullSurface = false, nullGas = false) {
    if (nullLiquid) {
      this.layers[1] = null;
      this.liquidVolume = 0;
    }
    if (nullSurface) {
      this.layers[2] = null;
    }
    if (nullGas) {
      this.layers[3] = null;
      this.gasVolume = 0;
    }
    this.flags |= Flags.CELL_CHANGED;
  }

  get ground() {
    return this.layers[Layer.GROUND]?.id || null;
  }
  get liquid() {
    return this.layers[Layer.LIQUID]?.id || null;
  }
  get surface() {
    return this.layers[Layer.SURFACE]?.id || null;
  }
  get gas() {
    return this.layers[Layer.GAS]?.id || null;
  }

  get groundTile(): Tile {
    return this.layers[Layer.GROUND] || TILES.NULL;
  }
  get liquidTile(): Tile {
    return this.layers[Layer.LIQUID] || TILES.NULL;
  }
  get surfaceTile(): Tile {
    return this.layers[Layer.SURFACE] || TILES.NULL;
  }
  get gasTile(): Tile {
    return this.layers[Layer.GAS] || TILES.NULL;
  }

  dump(): string {
    if (this.actor) return this.actor.sprite.ch as string;
    if (this.item) return this.item.sprite.ch as string;

    for (let i = this.layers.length - 1; i >= 0; --i) {
      if (!this.layers[i]) continue;
      const tile = this.layers[i] || TILES.NULL;
      if (tile.ch) return tile.ch as string;
    }
    return TILES[0].ch as string;
  }

  changed() {
    return this.flags & Flags.CELL_CHANGED;
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
  isRevealed(orMapped = false) {
    const flag = Flags.REVEALED | (orMapped ? Flags.MAGIC_MAPPED : 0);
    return this.flags & flag;
  }
  listInSidebar() {
    return this.hasTileMechFlag(TileMechFlags.TM_LIST_IN_SIDEBAR, true);
  }

  _needsRedraw() {
    this.flags |= Flags.NEEDS_REDRAW;
  }

  // TODO - Use functions in LIGHT to check these on cell.light directly???
  hasVisibleLight() {
    return Light.intensity(this.light) > CONFIG.light.INTENSITY_DARK;
  } // TODO
  isDark() {
    return Light.intensity(this.light) <= CONFIG.light.INTENSITY_DARK;
  } // TODO
  lightChanged() {
    return this.flags & Flags.LIGHT_CHANGED;
  } // TODO

  tile(layer = Layer.GROUND) {
    return this.layers[layer] || TILES.NULL;
  }

  *tiles(): Generator<Tile> {
    for (let tile of this.layers) {
      if (tile) {
        yield tile;
      }
    }
  }

  tileFlags(limitToPlayerKnowledge = false) {
    if (limitToPlayerKnowledge && !this.isVisible()) {
      return this.memory.tileFlags;
    }
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.flags;
    }
    return flags;
  }

  tileMechFlags(limitToPlayerKnowledge = false) {
    if (limitToPlayerKnowledge && !this.isVisible()) {
      return this.memory.tileMechFlags;
    }
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.mechFlags;
    }
    return flags;
  }

  hasTileFlag(flagMask = 0, limitToPlayerKnowledge = false) {
    const tileFlags = this.tileFlags(limitToPlayerKnowledge);
    return !!(flagMask & tileFlags);
  }

  hasAllTileFlags(flags = 0) {
    return (flags & this.tileFlags()) === flags;
  }

  hasTileMechFlag(flagMask = 0, limitToPlayerKnowledge = false) {
    const mechFlags = this.tileMechFlags(limitToPlayerKnowledge);
    return !!(flagMask & mechFlags);
  }

  hasAllTileMechFlags(flags = 0) {
    return (flags & this.tileMechFlags()) === flags;
  }

  setFlags(cellFlag = 0, cellMechFlag = 0) {
    this.flags |= cellFlag;
    this.mechFlags |= cellMechFlag;
    // this.flags |= Flags.NEEDS_REDRAW;
  }

  clearFlags(cellFlag = 0, cellMechFlag = 0) {
    this.flags &= ~cellFlag;
    this.mechFlags &= ~cellMechFlag;
    // if ((~cellFlag) & Flags.NEEDS_REDRAW) {
    //   this.flags |= Flags.NEEDS_REDRAW;
    // }
  }

  hasFlag(flag = 0, limitToPlayerKnowledge = false) {
    const flags =
      limitToPlayerKnowledge && !this.isAnyKindOfVisible()
        ? this.memory.cellFlags
        : this.flags;
    return !!(flag & flags);
  }

  hasMechFlag(flag = 0, limitToPlayerKnowledge = false) {
    const flags =
      limitToPlayerKnowledge && !this.isAnyKindOfVisible()
        ? this.memory.cellMechFlags
        : this.mechFlags;
    return !!(flag & flags);
  }

  hasTile(tile: string | Tile) {
    let id: string;
    if (tile instanceof Tile) {
      id = tile.id;
    } else {
      id = tile;
    }
    return this.layers.some((t) => t && t.id === id);
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

  successorTileFlags(id: string) {
    let flags = 0;
    for (let tile of this.tiles()) {
      flags |= tile.successorFlags(id);
    }
    return flags;
  }

  promotedTileFlags() {
    return this.successorTileFlags("promote");
  }

  discoveredTileFlags() {
    return this.successorTileFlags("discover");
  }

  hasDiscoveredTileFlag(flag: number) {
    // if (!this.hasTileMechFlag(TM_IS_SECRET)) return false;
    return this.discoveredTileFlags() & flag;
  }

  highestPriorityTile(skipGas = false): Tile {
    let best = TILES[0];
    let bestPriority = -10000;
    for (
      let layer = Layer.GROUND;
      layer <= (skipGas ? Layer.LIQUID : Layer.GAS);
      ++layer
    ) {
      // @ts-ignore
      const tile = this.layers[layer];
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
      if (tile.flags & tileFlag) return tile;
    }
    return null;
  }

  tileWithMechFlag(mechFlag: number) {
    for (let tile of this.tiles()) {
      if (tile.mechFlags & mechFlag) return tile;
    }
    return null;
  }

  tileDesc() {
    return this.highestPriorityTile().desc;
  }

  tileFlavor() {
    return this.highestPriorityTile().flavor;
  }

  getName(opts = {}) {
    return this.highestPriorityTile().getName(opts);
  }

  isNull(): boolean {
    return this.ground == null;
  }

  isEmpty(): boolean {
    return !(this._actor || this._item);
  }

  isPassableNow(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    const tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    if (!(tileFlags & TileFlags.T_PATHING_BLOCKER)) return true;
    if (tileFlags & TileFlags.T_BRIDGE) return true;

    return limitToPlayerKnowledge
      ? false
      : this.isSecretDoor(limitToPlayerKnowledge);
  }

  canBePassed(limitToPlayerKnowledge = false): boolean {
    if (this.isPassableNow(limitToPlayerKnowledge)) return true;
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileMechFlags = useMemory
      ? this.memory.tileMechFlags
      : this.tileMechFlags();
    if (tileMechFlags & TileMechFlags.TM_CONNECTS_LEVEL) return true;
    return !!(
      tileMechFlags & TileMechFlags.TM_PROMOTES &&
      !(this.promotedTileFlags() & TileFlags.T_PATHING_BLOCKER)
    );
  }

  isWall(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_OBSTRUCTS_EVERYTHING);
  }

  isObstruction(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_OBSTRUCTS_DIAGONAL_MOVEMENT);
  }

  isDoor(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_IS_DOOR);
  }

  isSecretDoor(limitToPlayerKnowledge = false): boolean {
    if (limitToPlayerKnowledge) return false;
    const tileMechFlags = this.tileMechFlags();
    return !!(
      tileMechFlags & TileMechFlags.TM_IS_SECRET &&
      !(this.discoveredTileFlags() & TileFlags.T_PATHING_BLOCKER)
    );
  }

  blocksPathing(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_PATHING_BLOCKER);
  }

  blocksVision(): boolean {
    let tileFlags = this.tileFlags();
    return !!(tileFlags & TileFlags.T_OBSTRUCTS_VISION);
  }

  isLiquid(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_IS_LIQUID);
  }

  hasGas(limitToPlayerKnowledge = false): boolean {
    const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
    let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
    return !!(tileFlags & TileFlags.T_GAS);
  }

  markRevealed() {
    this.flags &= ~Flags.STABLE_MEMORY;
    if (this.flags & Flags.REVEALED) return false;

    this.flags |= Flags.REVEALED;
    if (!this.hasTileFlag(TileFlags.T_PATHING_BLOCKER)) {
      DATA.xpxpThisTurn++;
    }
    return true;
  }

  obstructsLayer(layer: Layer) {
    return (
      layer == Layer.SURFACE && this.hasTileFlag(TileFlags.T_OBSTRUCTS_SURFACE)
    );
  }

  _setTile(tileId: Tile | string | null = null, volume = 0, map?: Map.Map) {
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
    } else if (!!tileId) {
      Utils.ERROR("Unknown tile: " + tileId);
    }

    if (!tile) {
      Utils.WARN("Unknown tile - " + tileId);
      tile = TILES.NULL;
      tileId = null;
    }

    const oldTile = this.layers[tile.layer] || TILES.NULL;
    const oldTileId = oldTile === TILES.NULL ? null : oldTile.id;

    if (
      (oldTile.flags & TileFlags.T_PATHING_BLOCKER) !=
      (tile.flags & TileFlags.T_PATHING_BLOCKER)
    ) {
      DATA.staleLoopMap = true;
    }

    if (
      tile.flags & TileFlags.T_IS_FIRE &&
      !(oldTile.flags & TileFlags.T_IS_FIRE)
    ) {
      this.setFlags(0, MechFlags.CAUGHT_FIRE_THIS_TURN);
    }

    const blocksVision = tile.flags & TileFlags.T_OBSTRUCTS_VISION;
    const oldBlocksVision = oldTile.flags & TileFlags.T_OBSTRUCTS_VISION;
    if (map && this.isAnyKindOfVisible() && blocksVision != oldBlocksVision) {
      map.setFlag(MapFlags.MAP_FOV_CHANGED);
    }

    if (oldTileId !== null) this.removeSprite(oldTile);
    this.layers[tile.layer] = tileId === null ? null : tile;
    if (tileId !== null) this.addSprite(tile.layer, tile);
    if (tile.layer == Layer.LIQUID) {
      this.liquidVolume =
        volume + (tileId == oldTileId ? this.liquidVolume : 0);
      if (map) map.clearFlag(MapFlags.MAP_NO_LIQUID);
    } else if (tile.layer == Layer.GAS) {
      this.gasVolume = volume + (tileId == oldTileId ? this.gasVolume : 0);
      if (map) map.clearFlag(MapFlags.MAP_NO_GAS);
    }

    if (tile.layer > 0 && this.layers[0] === null) {
      this.layers[0] = TILES.FLOOR; // TODO - Not good
    }

    // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    this.flags |= Flags.CELL_CHANGED;
    if (map && oldTile.light !== tile.light) {
      map.clearFlag(
        MapFlags.MAP_STABLE_GLOW_LIGHTS | MapFlags.MAP_STABLE_LIGHTS
      );
    }
    return true;
  }

  clearLayer(layer: Layer) {
    // @ts-ignore
    if (typeof layer === "string") layer = Layer[layer];

    const current = this.layers[layer];
    if (current) {
      // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
      this.flags |= Flags.CELL_CHANGED;
      this.removeSprite(current);
    }
    this.layers[layer] = null;
    if (layer == Layer.LIQUID) {
      this.liquidVolume = 0;
    } else if (layer == Layer.GAS) {
      this.gasVolume = 0;
    }
  }

  clearLayers(except: Layer = Layer.GROUND, ground?: string | null) {
    const floorTile = ground ? TILES[ground] : this.groundTile;
    for (let layer = 0; layer < this.layers.length; layer++) {
      if (layer != except && layer != Layer.GAS) {
        if (layer === Layer.GROUND) {
          if (floorTile !== this.groundTile) this._setTile(floorTile);
        } else {
          this.clearLayer(layer);
        }
      }
    }
    // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    this.flags |= Flags.CELL_CHANGED;
  }

  clearLayersWithFlags(tileFlags: number, tileMechFlags = 0) {
    for (let i = 0; i < this.layers.length; ++i) {
      const tile = this.layers[i];
      if (!tile) continue;
      if (tileFlags && tileMechFlags) {
        if (tile.flags & tileFlags && tile.mechFlags & tileMechFlags) {
          this.clearLayer(i);
        }
      } else if (tileFlags) {
        if (tile.flags & tileFlags) {
          this.clearLayer(i);
        }
      } else if (tileMechFlags) {
        if (tile.mechFlags & tileMechFlags) {
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
      this.removeSprite(this.item.sprite);
    }
    this._item = item;
    if (item) {
      this.flags |= Flags.HAS_ITEM;
      this.addSprite(Layer.ITEM, item.sprite);
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
      this.removeSprite(this.actor.sprite);
    }
    this._actor = actor;
    if (actor) {
      this.flags |= Flags.HAS_ACTOR;
      this.addSprite(Layer.ACTOR, actor.sprite);
    } else {
      this.flags &= ~Flags.HAS_ACTOR;
    }
  }

  // SPRITES

  addSprite(layer: Layer, sprite: Canvas.SpriteType, priority = 50) {
    if (!sprite) return;

    // this.flags |= Flags.NEEDS_REDRAW;
    this.flags |= Flags.CELL_CHANGED;

    if (
      !this.sprites ||
      this.sprites.layer > layer ||
      (this.sprites.layer == layer && this.sprites.priority > priority)
    ) {
      this.sprites = { layer, priority, sprite, next: this.sprites };
      return;
    }

    let current = this.sprites;
    while (
      current.next &&
      (current.layer < layer ||
        (current.layer == layer && current.priority <= priority))
    ) {
      current = current.next;
    }

    const item = { layer, priority, sprite, next: current.next };
    current.next = item;
  }

  removeSprite(sprite: Canvas.SpriteType) {
    if (!sprite) return false;
    if (!this.sprites) return false;

    // this.flags |= Flags.NEEDS_REDRAW;
    this.flags |= Flags.CELL_CHANGED;

    if (this.sprites && this.sprites.sprite === sprite) {
      this.sprites = this.sprites.next;
      return true;
    }

    let prev = this.sprites;
    let current = this.sprites.next;
    while (current) {
      if (current.sprite === sprite) {
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
    memory.cellFlags = this.flags;
    memory.cellMechFlags = this.mechFlags;
    memory.tile = this.highestPriorityTile();
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
    cell._setTile(tile);
  }
  return cell;
}

Make.cell = make;

export function getAppearance(cell: Cell, dest: Canvas.Mixer) {
  const memory = cell.memory.mixer;
  memory.blackOut();

  let needDistinctness =
    cell.tileMechFlags() & TileMechFlags.TM_VISUALLY_DISTINCT;

  let current = cell.sprites;
  while (current) {
    let alpha = current.sprite.opacity || 100;
    if (current.layer == Layer.LIQUID) {
      alpha = Utils.clamp(cell.liquidVolume || 0, 20, 100);
    } else if (current.layer == Layer.GAS) {
      alpha = Utils.clamp(cell.gasVolume || 0, 20, 100);
    }
    memory.drawSprite(current.sprite, alpha);
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
