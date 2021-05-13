import {
    color as Color,
    sprite as Sprite,
    utils as Utils,
    config as CONFIG,
    data as DATA,
    types as Types,
    random,
    make as Make,
    effect as Effect,
} from 'gw-utils';
import { Tile, tiles as TILES } from './tile';
import * as Map from './map';
import * as Light from './light';
import {
    Cell as Flags,
    CellMech as MechFlags,
    TileMech as TileMechFlags,
    Tile as TileFlags,
    Map as MapFlags,
    Entity as LayerFlags,
    Layer,
} from './mapFlags';

export { Flags, MechFlags };

// TODO - Move to gw-ui
Color.install('cursorColor', 25, 100, 150);
CONFIG.cursorPathIntensity = 50;

export class CellMemory {
    public mixer: Sprite.Mixer = new Sprite.Mixer();
    public item: Types.ItemType | null = null;
    public itemQuantity = 0;
    public actor: Types.ActorType | null = null;
    public tile: Tile | null = null;
    public flags = {
        cell: 0,
        cellMech: 0,
        layer: 0,
        tile: 0,
        tileMech: 0,
    };
    // public cellFlags = 0;
    // public cellMechFlags = 0;
    // public layerFlags = 0;
    // public tileFlags = 0;
    // public tileMechFlags = 0;

    constructor() {}

    clear() {
        this.mixer.nullify();
        this.item = null;
        this.itemQuantity = 0;
        this.actor = null;
        this.tile = null;
        this.flags.cell = 0;
        this.flags.cellMech = 0;
        this.flags.layer = 0;
        this.flags.tile = 0;
        this.flags.tileMech = 0;
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
    layer: Types.EntityType;
    next: LayerItem | null;
}

declare type LayerTile = Tile | null;

export class Cell implements Types.CellType {
    public _tiles: LayerTile[] = [];

    public layers: LayerItem | null = null;
    protected _actor: Types.ActorType | null = null;
    protected _item: Types.ItemType | null = null;
    public data: any = {};

    public flags: Types.CellFlags = { cell: Flags.CELL_DEFAULT, cellMech: 0 };
    public gasVolume = 0; // quantity of gas in cell
    public liquidVolume = 0;
    public machineNumber = 0;
    public memory: CellMemory = new CellMemory();

    public light: [number, number, number] = [100, 100, 100];
    public oldLight: [number, number, number] = [100, 100, 100];
    public glowLight: [number, number, number] = [100, 100, 100];

    public chokeCount = 0;

    constructor() {}

    copy(other: Cell) {
        Utils.copyObject(this, other);
    }

    nullify() {
        for (let i = 0; i < this._tiles.length; ++i) {
            this._tiles[i] = null;
        }
        this.layers = null;
        this._actor = null;
        this._item = null;
        this.data = {};

        this.flags.cell = Flags.CELL_DEFAULT; // non-terrain cell flags
        this.flags.cellMech = 0;
        this.gasVolume = 0; // quantity of gas in cell
        this.liquidVolume = 0;
        this.machineNumber = 0;
        this.memory.clear();

        this.light = [100, 100, 100];
        this.oldLight = [100, 100, 100];
        this.glowLight = [100, 100, 100];

        this.chokeCount = 0;
    }

    clear(floorTile: string | Tile = 'FLOOR') {
        this.nullify();
        if (typeof floorTile === 'string') {
            floorTile = TILES[floorTile];
        }
        if (floorTile) {
            this._tiles[0] = floorTile;
        }
    }

    clearLayers(
        layerFlag: number,
        floorTile: string | Tile = 'FLOOR'
    ): boolean {
        const layers = [Layer.GAS, Layer.LIQUID, Layer.SURFACE, Layer.GROUND];

        return layers.reduce((out: boolean, l: Layer) => {
            if (l & layerFlag) {
                return this.clearLayer(l, floorTile) || out;
            }
            return out;
        }, false);
    }

    // clearLayers(nullLiquid = false, nullSurface = false, nullGas = false) {
    //     if (nullLiquid) {
    //         this._tiles[1] = null;
    //         this.liquidVolume = 0;
    //     }
    //     if (nullSurface) {
    //         this._tiles[2] = null;
    //     }
    //     if (nullGas) {
    //         this._tiles[3] = null;
    //         this.gasVolume = 0;
    //     }
    //     this.flags.cell |= Flags.CELL_CHANGED;
    // }

    get ground() {
        return this._tiles[Layer.GROUND]?.id || null;
    }
    get liquid() {
        return this._tiles[Layer.LIQUID]?.id || null;
    }
    get surface() {
        return this._tiles[Layer.SURFACE]?.id || null;
    }
    get gas() {
        return this._tiles[Layer.GAS]?.id || null;
    }

    get groundTile(): Tile {
        return this._tiles[Layer.GROUND] || TILES.NULL;
    }
    get liquidTile(): Tile {
        return this._tiles[Layer.LIQUID] || TILES.NULL;
    }
    get surfaceTile(): Tile {
        return this._tiles[Layer.SURFACE] || TILES.NULL;
    }
    get gasTile(): Tile {
        return this._tiles[Layer.GAS] || TILES.NULL;
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
        return (this.flags.cell & Flags.CELL_CHANGED) > 0;
    }
    set changed(v: boolean) {
        if (v) {
            this.flags.cell |= Flags.CELL_CHANGED;
        } else {
            this.flags.cell &= ~Flags.CELL_CHANGED;
        }
    }

    isVisible() {
        return this.flags.cell & Flags.VISIBLE ? true : false;
    }
    isAnyKindOfVisible() {
        return (
            this.flags.cell &
            Flags.ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */
        );
    }
    isOrWasAnyKindOfVisible() {
        return (
            this.flags.cell &
            Flags.IS_WAS_ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */
        );
    }
    isRevealed(orMapped = false): boolean {
        const flag = Flags.REVEALED | (orMapped ? Flags.MAGIC_MAPPED : 0);
        return (this.flags.cell & flag) > 0;
    }
    listInSidebar(): boolean {
        return this.hasLayerFlag(LayerFlags.L_LIST_IN_SIDEBAR, true);
    }

    get needsRedraw() {
        return (this.flags.cell & Flags.NEEDS_REDRAW) > 0;
    }
    set needsRedraw(v: boolean) {
        if (v) {
            this.flags.cell |= Flags.NEEDS_REDRAW;
        } else {
            this.flags.cell &= ~Flags.NEEDS_REDRAW;
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
        return (this.flags.cell & Flags.LIGHT_CHANGED) > 0;
    }

    set lightChanged(v: boolean) {
        if (v) {
            this.flags.cell |= Flags.LIGHT_CHANGED | Flags.NEEDS_REDRAW;
        } else {
            this.flags.cell &= ~Flags.LIGHT_CHANGED;
        }
    }

    tile(layer = Layer.GROUND) {
        return this._tiles[layer] || TILES.NULL;
    }

    tileId(layer = Layer.GROUND) {
        return this._tiles[layer]?.id || null;
    }

    volume(layer = Layer.GAS) {
        if (layer === Layer.GAS) return this.gasVolume;
        if (layer === Layer.LIQUID) return this.liquidVolume;
        return 0;
    }

    setVolume(layer: Layer, volume = 0) {
        if (layer === Layer.GAS) {
            this.gasVolume = volume;
        } else if (layer === Layer.LIQUID) {
            this.liquidVolume = volume;
        }
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
            return this.memory.flags.layer;
        }
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.flags.layer;
        }
        return flags;
    }

    tileFlags(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge && !this.isVisible()) {
            return this.memory.flags.tile;
        }
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.flags.tile;
        }
        return flags;
    }

    tileMechFlags(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge && !this.isVisible()) {
            return this.memory.flags.tileMech;
        }
        let flags = 0;
        for (let tile of this.tiles()) {
            flags |= tile.flags.tileMech;
        }
        return flags;
    }

    hasLayerFlag(flag: LayerFlags, limitToPlayerKnowledge = false) {
        const flags = this.layerFlags(limitToPlayerKnowledge);
        if (flag & flags) return true;
        let actor = this.actor;
        let item = this.item;
        if (limitToPlayerKnowledge) {
            actor = this.memory.actor;
            item = this.memory.item;
        }
        if (actor && actor.layerFlags() & flag) return true;
        if (item && item.layerFlags() & flag) return true;
        return false;
    }

    hasAllLayerFlags(flag: LayerFlags, limitToPlayerKnowledge = false) {
        let flags = this.layerFlags(limitToPlayerKnowledge);
        let actor = this.actor;
        let item = this.item;
        if (limitToPlayerKnowledge) {
            actor = this.memory.actor;
            item = this.memory.item;
        }
        if (actor) flags |= actor.layerFlags();
        if (item) flags |= item.layerFlags();

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
        this.flags.cell |= cellFlag;
        this.flags.cellMech |= cellMechFlag;
        // this.flags.cell |= Flags.NEEDS_REDRAW;
    }

    clearFlags(cellFlag: Flags = 0, cellMechFlag: MechFlags = 0) {
        this.flags.cell &= ~cellFlag;
        this.flags.cellMech &= ~cellMechFlag;
        // if ((~cellFlag) & Flags.NEEDS_REDRAW) {
        //   this.flags.cell |= Flags.NEEDS_REDRAW;
        // }
    }

    hasFlag(flag: Flags, limitToPlayerKnowledge = false) {
        const flags =
            limitToPlayerKnowledge && !this.isAnyKindOfVisible()
                ? this.memory.flags.cell
                : this.flags.cell;
        return (flag & flags) > 0;
    }

    hasMechFlag(flag: MechFlags, limitToPlayerKnowledge = false) {
        const flags =
            limitToPlayerKnowledge && !this.isAnyKindOfVisible()
                ? this.memory.flags.cellMech
                : this.flags.cellMech;
        return (flag & flags) > 0;
    }

    hasTile(tile: string | Types.TileType) {
        let id: string;
        if (typeof tile === 'string') {
            id = tile;
        } else {
            id = tile.id;
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
            let layer = Layer.GROUND;
            layer <= (skipGas ? Layer.LIQUID : Layer.GAS);
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

    tileWithLayerFlag(layerFlag: number) {
        for (let tile of this.tiles()) {
            if (tile.flags.layer & layerFlag) return tile;
        }
        return null;
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

    isNull(): boolean {
        return this.ground === null;
    }

    isClear(): boolean {
        return (
            this.liquid === null && this.gas === null && this.surface === null
        );
    }

    isEmpty(): boolean {
        return !(this._actor || this._item);
    }

    isMoveableNow(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags(false);
        return (layerFlags & LayerFlags.L_BLOCKS_MOVE) === 0;
    }

    isWalkableNow(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags(false);
        if (layerFlags & LayerFlags.L_BLOCKS_MOVE) return false;

        const tileFlags = useMemory ? this.memory.flags.tile : this.tileFlags();
        if (!(tileFlags & TileFlags.T_IS_DEEP_LIQUID)) return true;
        return (tileFlags & TileFlags.T_BRIDGE) > 0;
    }

    canBeWalked(limitToPlayerKnowledge = false): boolean {
        if (this.isWalkableNow(limitToPlayerKnowledge)) return true;
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags(false);
        return (layerFlags & LayerFlags.L_SECRETLY_PASSABLE) > 0;
    }

    isWall(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags();
        return (layerFlags & LayerFlags.L_IS_WALL) === LayerFlags.L_IS_WALL;
    }

    isObstruction(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_DIAGONAL);
    }

    isDoorway(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory
            ? this.memory.flags.layer
            : this.layerFlags();
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
        let tileFlags = useMemory ? this.memory.flags.tile : this.tileFlags();
        return !!(tileFlags & TileFlags.T_PATHING_BLOCKER);
    }

    blocksVision(): boolean {
        const layerFlags = this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_VISION);
    }

    blocksEffects(): boolean {
        const layerFlags = this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_EFFECTS);
    }

    isLiquid(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.flags.tile : this.tileFlags();
        return !!(tileFlags & TileFlags.T_IS_DEEP_LIQUID);
    }

    // TODO - Should this look at the tiles instead of the flags?
    // What if a gas tile is not set with T_GAS?
    // Should we force T_GAS if layer === GAS when creating a tile?
    // Should these be cell flags - indicating we have this layer
    hasGas(limitToPlayerKnowledge = false): boolean {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let cellFlags = useMemory ? this.memory.flags.cell : this.flags.cell;
        return !!(cellFlags & Flags.HAS_GAS);
    }

    // TODO - Check floor and actor
    hasKey() {
        return false;
    }

    markRevealed() {
        this.flags.cell &= ~Flags.STABLE_MEMORY;
        if (this.flags.cell & Flags.REVEALED) return false;

        this.flags.cell |= Flags.REVEALED;
        return !this.isWall();
    }

    obstructsLayer(depth: Layer) {
        return (
            depth === Layer.SURFACE &&
            this.hasLayerFlag(LayerFlags.L_BLOCKS_SURFACE)
        );
    }

    setTile(tileId: TileBase | null = null, volume = 0, map?: Map.Map) {
        map = map || DATA.map;
        let tile;
        if (tileId === null) {
            tile = TILES.NULL;
            tileId = null;
        } else if (typeof tileId === 'string') {
            tile = TILES[tileId];
        } else if (tileId instanceof Tile) {
            tile = tileId;
            tileId = tile.id;
        }

        if (!tile) {
            return Utils.ERROR('Unknown tile - ' + tileId);
        }

        if (tile.layer > 0 && !this._tiles[0]) {
            this.setTile(tile.defaultGround || TILES.FLOOR, 0, map); // TODO - do not use FLOOR?  Does map have the tile to use?
        }

        const oldTile = this._tiles[tile.layer] || TILES.NULL;
        const oldTileId = oldTile === TILES.NULL ? null : oldTile.id;

        if (oldTile.blocksPathing() != tile.blocksPathing()) {
            DATA.staleLoopMap = true;
        }

        if (
            tile.flags.tile & TileFlags.T_IS_FIRE &&
            !(oldTile.flags.tile & TileFlags.T_IS_FIRE)
        ) {
            this.flags.cellMech |= MechFlags.CAUGHT_FIRE_THIS_TURN;
        }

        const blocksVision = tile.flags.layer & LayerFlags.L_BLOCKS_VISION;
        const oldBlocksVision =
            oldTile.flags.layer & LayerFlags.L_BLOCKS_VISION;
        if (
            map &&
            this.isAnyKindOfVisible() &&
            blocksVision != oldBlocksVision
        ) {
            map.setFlag(MapFlags.MAP_FOV_CHANGED);
        }

        if (oldTileId !== null) this.removeLayer(oldTile);
        this._tiles[tile.layer] = tileId === null ? null : tile;
        if (tileId !== null) this.addLayer(tile);

        let layerFlag = 0;
        if (tile.layer == Layer.LIQUID) {
            layerFlag = Flags.HAS_LIQUID;
            this.liquidVolume =
                volume + (tileId == oldTileId ? this.liquidVolume : 0);
            if (map) map.clearFlag(MapFlags.MAP_NO_LIQUID);
        } else if (tile.layer == Layer.GAS) {
            layerFlag = Flags.HAS_GAS;
            this.gasVolume =
                volume + (tileId == oldTileId ? this.gasVolume : 0);
            if (map) map.clearFlag(MapFlags.MAP_NO_GAS);
        } else if (tile.layer === Layer.SURFACE) {
            layerFlag = Flags.HAS_SURFACE;
        }

        if (tileId) {
            this.flags.cell |= layerFlag;
        } else {
            this.flags.cell &= ~layerFlag;
        }

        // this.flags.cell |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags.cell |= Flags.CELL_CHANGED | Flags.NEEDS_REDRAW;
        if (map && oldTile.light !== tile.light) {
            map.clearFlag(
                MapFlags.MAP_STABLE_GLOW_LIGHTS | MapFlags.MAP_STABLE_LIGHTS
            );
        }
        return true;
    }

    clearLayer(depth: Layer, floorTile: string | Tile = 'FLOOR'): boolean {
        // @ts-ignore
        if (typeof depth === 'string') depth = Layer[depth];

        const current = this._tiles[depth];

        let didSomething = false;
        if (depth === Layer.GROUND) {
            if (typeof floorTile === 'string') {
                floorTile = TILES[floorTile] || TILES.FLOOR;
            }
        }
        if (current) {
            // this.flags.cell |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
            this.flags.cell |= Flags.CELL_CHANGED;
            this.removeLayer(current);
            didSomething =
                current && (depth !== Layer.GROUND || current !== floorTile);
        }
        this._tiles[depth] = null;
        let layerFlag = 0;
        if (depth == Layer.LIQUID) {
            layerFlag = Flags.HAS_LIQUID;
            this.liquidVolume = 0;
        } else if (depth == Layer.GAS) {
            layerFlag = Flags.HAS_GAS;
            this.gasVolume = 0;
        } else if (depth == Layer.SURFACE) {
            layerFlag = Flags.HAS_SURFACE;
        } else if (depth == Layer.GROUND) {
            this._tiles[Layer.GROUND] = floorTile as Tile;
        }
        this.flags.cell &= ~layerFlag;
        return didSomething;
    }

    clearLayersExcept(except: Layer = Layer.GROUND, ground?: string | null) {
        const floorTile = ground ? TILES[ground] : this.groundTile;
        for (let layer = 0; layer < this._tiles.length; layer++) {
            if (layer != except && layer != Layer.GAS) {
                if (layer === Layer.GROUND) {
                    if (floorTile !== this.groundTile) this.setTile(floorTile);
                } else {
                    this.clearLayer(layer);
                }
            }
        }
        // this.flags.cell |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags.cell |= Flags.CELL_CHANGED;
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
        // this.flags.cell |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    }

    // EVENTS

    async activate(
        name: string,
        map: Map.Map,
        x: number,
        y: number,
        ctx: any = {}
    ) {
        ctx.cell = this;
        let fired = false;

        if (ctx.layer !== undefined) {
            const tile = this.tile(ctx.layer);
            if (tile && tile.activates) {
                const ev = tile.activates[name];
                let effect: Effect.Effect;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                } else {
                    effect = ev;
                }
                if (effect) {
                    // console.log(' - has event');
                    if (
                        ctx.force ||
                        !effect.chance ||
                        random.chance(effect.chance, 10000)
                    ) {
                        ctx.tile = tile;
                        // console.log(' - spawn event @%d,%d - %s', x, y, name);
                        fired = await effect.fire(map, x, y, ctx);
                        // cell.debug(" - spawned");
                    }
                }
            }
        } else {
            // console.log('fire event - %s', name);
            for (let tile of this.tiles()) {
                if (!tile.activates) continue;
                const ev = tile.activates[name];
                // console.log(' - ', ev);

                let effect: Effect.Effect;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                } else {
                    effect = ev;
                }
                if (effect) {
                    // cell.debug(" - has event");
                    if (
                        ctx.force ||
                        !effect.chance ||
                        random.chance(effect.chance, 10000)
                    ) {
                        ctx.tile = tile;
                        // console.log(' - spawn event @%d,%d - %s', x, y, name);
                        fired = (await effect.fire(map, x, y, ctx)) || fired;
                        // cell.debug(" - spawned");
                        if (fired) {
                            break;
                        }
                    }
                }
            }
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
            this.flags.cell |= Flags.HAS_ITEM;
            this.addLayer(item);
        } else {
            this.flags.cell &= ~Flags.HAS_ITEM;
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
            this.flags.cell |= Flags.HAS_ANY_ACTOR;
            this.addLayer(actor);
        } else {
            this.flags.cell &= ~Flags.HAS_ANY_ACTOR;
        }
    }

    addLayer(layer: Types.EntityType) {
        if (!layer) return;

        // this.flags.cell |= Flags.NEEDS_REDRAW;
        this.flags.cell |= Flags.CELL_CHANGED;
        let current = this.layers;

        if (
            !current ||
            current.layer.layer > layer.layer ||
            (current.layer.layer == layer.layer &&
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
            (current.next.layer.layer < layer.layer ||
                (current.next.layer.layer == layer.layer &&
                    current.next.layer.priority <= layer.priority))
        ) {
            current = current.next;
        }

        const item = {
            layer,
            next: current.next,
        };
        current.next = item;
    }

    removeLayer(layer: Types.EntityType) {
        if (!layer) return false;
        if (!this.layers) return false;

        // this.flags.cell |= Flags.NEEDS_REDRAW;
        this.flags.cell |= Flags.CELL_CHANGED;

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
        memory.flags.tile = this.tileFlags();
        memory.flags.tileMech = this.tileMechFlags();
        memory.flags.layer = this.layerFlags();
        memory.flags.cell = this.flags.cell;
        memory.flags.cellMech = this.flags.cellMech;
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
            if (
                this.actor.rememberedInCell &&
                this.actor.rememberedInCell !== this
            ) {
                // console.log("remembered in cell change");
                this.actor.rememberedInCell.storeMemory();
                this.actor.rememberedInCell.flags.cell |= Flags.NEEDS_REDRAW;
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

export function getAppearance(cell: Cell, dest: Sprite.Mixer) {
    const memory = cell.memory.mixer;
    memory.blackOut();

    let needDistinctness = cell.layerFlags() & LayerFlags.L_VISUALLY_DISTINCT;

    let current = cell.layers;
    while (current) {
        const layer = current.layer;
        let alpha = layer.sprite.opacity || 100;
        if (layer.layer == Layer.LIQUID) {
            alpha = Utils.clamp(cell.liquidVolume * 34, 20, 100);
        } else if (layer.layer == Layer.GAS) {
            alpha = Utils.clamp(cell.gasVolume * 34, 20, 100);
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

    if (memory.dances) {
        cell.flags.cell |= Flags.COLORS_DANCE;
    } else {
        cell.flags.cell &= ~Flags.COLORS_DANCE;
    }

    dest.drawSprite(memory);
    return true;
}
