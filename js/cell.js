import { color as Color, sprite as Sprite, utils as Utils, config as CONFIG, data as DATA, random, make as Make, effect as Effect, } from 'gw-utils';
import { Tile, tiles as TILES } from './tile';
import * as Light from './light';
import { Cell as Flags, CellMech as MechFlags, Tile as TileFlags, Map as MapFlags, Entity as LayerFlags, Layer, } from './flags';
export { Flags, MechFlags };
// TODO - Move to gw-ui
Color.install('cursorColor', 25, 100, 150);
CONFIG.cursorPathIntensity = 50;
export class CellMemory {
    constructor() {
        this.mixer = new Sprite.Mixer();
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
    copy(other) {
        const mixer = this.mixer;
        Object.assign(this, other);
        this.mixer = mixer;
        this.mixer.copy(other.mixer);
    }
}
export class Cell {
    constructor() {
        this._tiles = [];
        this.layers = null;
        this._actor = null;
        this._item = null;
        this.data = {};
        this.flags = Flags.CELL_DEFAULT; // non-terrain cell flags
        this.mechFlags = 0;
        this.gasVolume = 0; // quantity of gas in cell
        this.liquidVolume = 0;
        this.machineNumber = 0;
        this.memory = new CellMemory();
        this.light = [100, 100, 100];
        this.oldLight = [100, 100, 100];
        this.glowLight = [100, 100, 100];
    }
    copy(other) {
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
    clear(floorTile = 'FLOOR') {
        this.nullify();
        if (typeof floorTile === 'string') {
            floorTile = TILES[floorTile];
        }
        if (floorTile) {
            this._tiles[0] = floorTile;
        }
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
    //     this.flags |= Flags.CELL_CHANGED;
    // }
    get ground() {
        var _a;
        return ((_a = this._tiles[Layer.GROUND]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get liquid() {
        var _a;
        return ((_a = this._tiles[Layer.LIQUID]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get surface() {
        var _a;
        return ((_a = this._tiles[Layer.SURFACE]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get gas() {
        var _a;
        return ((_a = this._tiles[Layer.GAS]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    get groundTile() {
        return this._tiles[Layer.GROUND] || TILES.NULL;
    }
    get liquidTile() {
        return this._tiles[Layer.LIQUID] || TILES.NULL;
    }
    get surfaceTile() {
        return this._tiles[Layer.SURFACE] || TILES.NULL;
    }
    get gasTile() {
        return this._tiles[Layer.GAS] || TILES.NULL;
    }
    dump() {
        if (this.actor)
            return this.actor.sprite.ch;
        if (this.item)
            return this.item.sprite.ch;
        for (let i = this._tiles.length - 1; i >= 0; --i) {
            if (!this._tiles[i])
                continue;
            const tile = this._tiles[i] || TILES.NULL;
            if (tile.sprite.ch)
                return tile.sprite.ch;
        }
        return TILES.NULL.sprite.ch;
    }
    get changed() {
        return (this.flags & Flags.CELL_CHANGED) > 0;
    }
    set changed(v) {
        if (v) {
            this.flags |= Flags.CELL_CHANGED;
        }
        else {
            this.flags &= ~Flags.CELL_CHANGED;
        }
    }
    isVisible() {
        return this.flags & Flags.VISIBLE ? true : false;
    }
    isAnyKindOfVisible() {
        return (this.flags &
            Flags.ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
    }
    isOrWasAnyKindOfVisible() {
        return (this.flags &
            Flags.IS_WAS_ANY_KIND_OF_VISIBLE /* || CONFIG.playbackOmniscience */);
    }
    isRevealed(orMapped = false) {
        const flag = Flags.REVEALED | (orMapped ? Flags.MAGIC_MAPPED : 0);
        return (this.flags & flag) > 0;
    }
    listInSidebar() {
        return this.hasLayerFlag(LayerFlags.L_LIST_IN_SIDEBAR, true);
    }
    get needsRedraw() {
        return (this.flags & Flags.NEEDS_REDRAW) > 0;
    }
    set needsRedraw(v) {
        if (v) {
            this.flags |= Flags.NEEDS_REDRAW;
        }
        else {
            this.flags &= ~Flags.NEEDS_REDRAW;
        }
    }
    // TODO - Use functions in LIGHT to check these on cell.light directly???
    hasVisibleLight() {
        return Light.intensity(this.light) > CONFIG.light.INTENSITY_DARK;
    } // TODO
    isDark(darkColor) {
        const intensity = darkColor
            ? Light.intensity(darkColor)
            : CONFIG.light.INTENSITY_DARK;
        return Light.intensity(this.light) <= intensity;
    } // TODO
    get lightChanged() {
        return (this.flags & Flags.LIGHT_CHANGED) > 0;
    }
    set lightChanged(v) {
        if (v) {
            this.flags |= Flags.LIGHT_CHANGED | Flags.NEEDS_REDRAW;
        }
        else {
            this.flags &= ~Flags.LIGHT_CHANGED;
        }
    }
    tile(layer = Layer.GROUND) {
        return this._tiles[layer] || TILES.NULL;
    }
    tileId(layer = Layer.GROUND) {
        var _a;
        return ((_a = this._tiles[layer]) === null || _a === void 0 ? void 0 : _a.id) || null;
    }
    volume(layer = Layer.GAS) {
        if (layer === Layer.GAS)
            return this.gasVolume;
        if (layer === Layer.LIQUID)
            return this.liquidVolume;
        return 0;
    }
    setVolume(layer, volume = 0) {
        if (layer === Layer.GAS) {
            this.gasVolume = volume;
        }
        else if (layer === Layer.LIQUID) {
            this.liquidVolume = volume;
        }
    }
    *tiles() {
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
    hasLayerFlag(flag, limitToPlayerKnowledge = false) {
        const flags = this.layerFlags(limitToPlayerKnowledge);
        return !!(flag & flags);
    }
    hasAllLayerFlags(flag, limitToPlayerKnowledge = false) {
        const flags = this.layerFlags(limitToPlayerKnowledge);
        return (flag & flags) === flag;
    }
    hasTileFlag(flagMask, limitToPlayerKnowledge = false) {
        const tileFlags = this.tileFlags(limitToPlayerKnowledge);
        return !!(flagMask & tileFlags);
    }
    hasAllTileFlags(flags, limitToPlayerKnowledge = false) {
        return (flags & this.tileFlags(limitToPlayerKnowledge)) === flags;
    }
    hasTileMechFlag(flagMask, limitToPlayerKnowledge = false) {
        const mechFlags = this.tileMechFlags(limitToPlayerKnowledge);
        return !!(flagMask & mechFlags);
    }
    hasAllTileMechFlags(flags, limitToPlayerKnowledge = false) {
        return (flags & this.tileMechFlags(limitToPlayerKnowledge)) === flags;
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
    hasFlag(flag, limitToPlayerKnowledge = false) {
        const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
            ? this.memory.cellFlags
            : this.flags;
        return (flag & flags) > 0;
    }
    hasMechFlag(flag, limitToPlayerKnowledge = false) {
        const flags = limitToPlayerKnowledge && !this.isAnyKindOfVisible()
            ? this.memory.cellMechFlags
            : this.mechFlags;
        return (flag & flags) > 0;
    }
    hasTile(tile) {
        let id;
        if (typeof tile === 'string') {
            id = tile;
        }
        else {
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
    topmostTile(skipGas = false) {
        let best = TILES.NULL;
        let bestPriority = -10000;
        for (let layer = Layer.GROUND; layer <= (skipGas ? Layer.LIQUID : Layer.GAS); ++layer) {
            // @ts-ignore
            const tile = this._tiles[layer];
            if (!tile)
                continue;
            if (tile.priority > bestPriority) {
                best = tile;
                bestPriority = tile.priority;
            }
        }
        return best;
    }
    tileWithLayerFlag(layerFlag) {
        for (let tile of this.tiles()) {
            if (tile.flags.layer & layerFlag)
                return tile;
        }
        return null;
    }
    tileWithFlag(tileFlag) {
        for (let tile of this.tiles()) {
            if (tile.flags.tile & tileFlag)
                return tile;
        }
        return null;
    }
    tileWithMechFlag(mechFlag) {
        for (let tile of this.tiles()) {
            if (tile.flags.tileMech & mechFlag)
                return tile;
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
    isNull() {
        return this.ground === null;
    }
    isClear() {
        return (this.liquid === null && this.gas === null && this.surface === null);
    }
    isEmpty() {
        return !(this._actor || this._item);
    }
    isMoveableNow(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.layerFlags
            : this.layerFlags(false);
        return (layerFlags & LayerFlags.L_BLOCKS_MOVE) === 0;
    }
    isWalkableNow(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.layerFlags
            : this.layerFlags(false);
        if (layerFlags & LayerFlags.L_BLOCKS_MOVE)
            return false;
        const tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        if (!(tileFlags & TileFlags.T_IS_DEEP_LIQUID))
            return true;
        return (tileFlags & TileFlags.T_BRIDGE) > 0;
    }
    canBeWalked(limitToPlayerKnowledge = false) {
        if (this.isWalkableNow(limitToPlayerKnowledge))
            return true;
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        const layerFlags = useMemory
            ? this.memory.layerFlags
            : this.layerFlags(false);
        return (layerFlags & LayerFlags.L_SECRETLY_PASSABLE) > 0;
    }
    isWall(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
        return (layerFlags & LayerFlags.L_IS_WALL) === LayerFlags.L_IS_WALL;
    }
    isObstruction(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_DIAGONAL);
    }
    isDoorway(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let layerFlags = useMemory ? this.memory.layerFlags : this.layerFlags();
        return ((layerFlags & LayerFlags.L_BLOCKS_VISION) > 0 &&
            (layerFlags & LayerFlags.L_BLOCKS_MOVE) === 0);
    }
    isSecretDoorway(limitToPlayerKnowledge = false) {
        if (limitToPlayerKnowledge)
            return false;
        const layerFlags = this.layerFlags(limitToPlayerKnowledge);
        return (layerFlags & LayerFlags.L_SECRETLY_PASSABLE) > 0;
    }
    blocksPathing(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        if (!this.isWalkableNow(limitToPlayerKnowledge))
            return true;
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & TileFlags.T_PATHING_BLOCKER);
    }
    blocksVision() {
        const layerFlags = this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_VISION);
    }
    blocksEffects() {
        const layerFlags = this.layerFlags();
        return !!(layerFlags & LayerFlags.L_BLOCKS_EFFECTS);
    }
    isLiquid(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let tileFlags = useMemory ? this.memory.tileFlags : this.tileFlags();
        return !!(tileFlags & TileFlags.T_IS_DEEP_LIQUID);
    }
    // TODO - Should this look at the tiles instead of the flags?
    // What if a gas tile is not set with T_GAS?
    // Should we force T_GAS if layer === GAS when creating a tile?
    // Should these be cell flags - indicating we have this layer
    hasGas(limitToPlayerKnowledge = false) {
        const useMemory = limitToPlayerKnowledge && !this.isAnyKindOfVisible();
        let cellFlags = useMemory ? this.memory.cellFlags : this.flags;
        return !!(cellFlags & Flags.HAS_GAS);
    }
    // TODO - Check floor and actor
    hasKey() {
        return false;
    }
    markRevealed() {
        this.flags &= ~Flags.STABLE_MEMORY;
        if (this.flags & Flags.REVEALED)
            return false;
        this.flags |= Flags.REVEALED;
        return !this.isWall();
    }
    obstructsLayer(depth) {
        return (depth === Layer.SURFACE &&
            this.hasLayerFlag(LayerFlags.L_BLOCKS_SURFACE));
    }
    setTile(tileId = null, volume = 0, map) {
        map = map || DATA.map;
        let tile;
        if (tileId === null) {
            tile = TILES.NULL;
            tileId = null;
        }
        else if (typeof tileId === 'string') {
            tile = TILES[tileId];
        }
        else if (tileId instanceof Tile) {
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
        if (tile.flags.tile & TileFlags.T_IS_FIRE &&
            !(oldTile.flags.tile & TileFlags.T_IS_FIRE)) {
            this.mechFlags |= MechFlags.CAUGHT_FIRE_THIS_TURN;
        }
        const blocksVision = tile.flags.layer & LayerFlags.L_BLOCKS_VISION;
        const oldBlocksVision = oldTile.flags.layer & LayerFlags.L_BLOCKS_VISION;
        if (map &&
            this.isAnyKindOfVisible() &&
            blocksVision != oldBlocksVision) {
            map.setFlag(MapFlags.MAP_FOV_CHANGED);
        }
        if (oldTileId !== null)
            this.removeLayer(oldTile);
        this._tiles[tile.layer] = tileId === null ? null : tile;
        if (tileId !== null)
            this.addLayer(tile);
        let layerFlag = 0;
        if (tile.layer == Layer.LIQUID) {
            layerFlag = Flags.HAS_LIQUID;
            this.liquidVolume =
                volume + (tileId == oldTileId ? this.liquidVolume : 0);
            if (map)
                map.clearFlag(MapFlags.MAP_NO_LIQUID);
        }
        else if (tile.layer == Layer.GAS) {
            layerFlag = Flags.HAS_GAS;
            this.gasVolume =
                volume + (tileId == oldTileId ? this.gasVolume : 0);
            if (map)
                map.clearFlag(MapFlags.MAP_NO_GAS);
        }
        else if (tile.layer === Layer.SURFACE) {
            layerFlag = Flags.HAS_SURFACE;
        }
        if (tileId) {
            this.flags |= layerFlag;
        }
        else {
            this.flags &= ~layerFlag;
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags |= Flags.CELL_CHANGED | Flags.NEEDS_REDRAW;
        if (map && oldTile.light !== tile.light) {
            map.clearFlag(MapFlags.MAP_STABLE_GLOW_LIGHTS | MapFlags.MAP_STABLE_LIGHTS);
        }
        return true;
    }
    clearLayer(depth) {
        // @ts-ignore
        if (typeof depth === 'string')
            depth = Layer[depth];
        const current = this._tiles[depth];
        if (current) {
            // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
            this.flags |= Flags.CELL_CHANGED;
            this.removeLayer(current);
        }
        this._tiles[depth] = null;
        let layerFlag = 0;
        if (depth == Layer.LIQUID) {
            layerFlag = Flags.HAS_LIQUID;
            this.liquidVolume = 0;
        }
        else if (depth == Layer.GAS) {
            layerFlag = Flags.HAS_GAS;
            this.gasVolume = 0;
        }
        else if (depth == Layer.SURFACE) {
            layerFlag = Flags.HAS_SURFACE;
        }
        else if (depth == Layer.GROUND) {
            this._tiles[Layer.GROUND] = TILES.FLOOR; // TODO - ????!!!
        }
        this.flags &= ~layerFlag;
    }
    clearLayersExcept(except = Layer.GROUND, ground) {
        const floorTile = ground ? TILES[ground] : this.groundTile;
        for (let layer = 0; layer < this._tiles.length; layer++) {
            if (layer != except && layer != Layer.GAS) {
                if (layer === Layer.GROUND) {
                    if (floorTile !== this.groundTile)
                        this.setTile(floorTile);
                }
                else {
                    this.clearLayer(layer);
                }
            }
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
        this.flags |= Flags.CELL_CHANGED;
    }
    clearLayersWithFlags(tileFlags, tileMechFlags = 0) {
        for (let i = 0; i < this._tiles.length; ++i) {
            const tile = this._tiles[i];
            if (!tile)
                continue;
            if (tileFlags && tileMechFlags) {
                if (tile.flags.tile & tileFlags &&
                    tile.flags.tileMech & tileMechFlags) {
                    this.clearLayer(i);
                }
            }
            else if (tileFlags) {
                if (tile.flags.tile & tileFlags) {
                    this.clearLayer(i);
                }
            }
            else if (tileMechFlags) {
                if (tile.flags.tileMech & tileMechFlags) {
                    this.clearLayer(i);
                }
            }
        }
        // this.flags |= (Flags.NEEDS_REDRAW | Flags.CELL_CHANGED);
    }
    // EVENTS
    async activate(name, map, x, y, ctx = {}) {
        ctx.cell = this;
        let fired = false;
        if (ctx.layer !== undefined) {
            const tile = this.tile(ctx.layer);
            if (tile && tile.activates) {
                const ev = tile.activates[name];
                let effect;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                }
                else {
                    effect = ev;
                }
                if (effect) {
                    // console.log(' - has event');
                    if (ctx.force ||
                        !effect.chance ||
                        random.chance(effect.chance, 10000)) {
                        ctx.tile = tile;
                        // console.log(' - spawn event @%d,%d - %s', x, y, name);
                        fired = await effect.fire(map, x, y, ctx);
                        // cell.debug(" - spawned");
                    }
                }
            }
        }
        else {
            // cell.debug("fire event - %s", name);
            for (let tile of this.tiles()) {
                if (!tile.activates)
                    continue;
                const ev = tile.activates[name];
                let effect;
                if (typeof ev === 'string') {
                    effect = Effect.effects[ev];
                }
                else {
                    effect = ev;
                }
                if (effect) {
                    // cell.debug(" - has event");
                    if (ctx.force ||
                        !effect.chance ||
                        random.chance(effect.chance, 10000)) {
                        ctx.tile = tile;
                        // cell.debug(" - spawn event @%d,%d - %s", ctx.x, ctx.y, name);
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
    activatesOn(name) {
        for (let tile of this.tiles()) {
            if (tile.activatesOn(name))
                return true;
        }
        return false;
    }
    // ITEM
    get item() {
        return this._item;
    }
    set item(item) {
        if (this.item) {
            this.removeLayer(this.item);
        }
        this._item = item;
        if (item) {
            this.flags |= Flags.HAS_ITEM;
            this.addLayer(item);
        }
        else {
            this.flags &= ~Flags.HAS_ITEM;
        }
    }
    // ACTOR
    get actor() {
        return this._actor;
    }
    set actor(actor) {
        if (this.actor) {
            this.removeLayer(this.actor);
        }
        this._actor = actor;
        if (actor) {
            this.flags |= Flags.HAS_ANY_ACTOR;
            this.addLayer(actor);
        }
        else {
            this.flags &= ~Flags.HAS_ANY_ACTOR;
        }
    }
    addLayer(layer) {
        if (!layer)
            return;
        // this.flags |= Flags.NEEDS_REDRAW;
        this.flags |= Flags.CELL_CHANGED;
        let current = this.layers;
        if (!current ||
            current.layer.layer > layer.layer ||
            (current.layer.layer == layer.layer &&
                current.layer.priority > layer.priority)) {
            this.layers = {
                layer,
                next: current,
            };
            return;
        }
        while (current.next &&
            (current.layer.layer < layer.layer ||
                (current.layer.layer == layer.layer &&
                    current.layer.priority <= layer.priority))) {
            current = current.next;
        }
        const item = {
            layer,
            next: current.next,
        };
        current.next = item;
    }
    removeLayer(layer) {
        if (!layer)
            return false;
        if (!this.layers)
            return false;
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
        }
        else {
            memory.item = null;
            memory.itemQuantity = 0;
        }
        memory.actor = this.actor;
        getAppearance(this, memory.mixer);
        if (this.actor && this.isOrWasAnyKindOfVisible()) {
            if (this.actor.rememberedInCell &&
                this.actor.rememberedInCell !== this) {
                // console.log("remembered in cell change");
                this.actor.rememberedInCell.storeMemory();
                this.actor.rememberedInCell.flags |= Flags.NEEDS_REDRAW;
            }
            this.actor.rememberedInCell = this;
        }
    }
}
export function make(tile) {
    const cell = new Cell();
    if (tile) {
        cell.setTile(tile);
    }
    return cell;
}
Make.cell = make;
export function getAppearance(cell, dest) {
    const memory = cell.memory.mixer;
    memory.blackOut();
    let needDistinctness = cell.layerFlags() & LayerFlags.L_VISUALLY_DISTINCT;
    let current = cell.layers;
    while (current) {
        const layer = current.layer;
        let alpha = layer.sprite.opacity || 100;
        if (layer.layer == Layer.LIQUID) {
            alpha = Utils.clamp(cell.liquidVolume * 34, 20, 100);
        }
        else if (layer.layer == Layer.GAS) {
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
    dest.drawSprite(memory);
    return true;
}
