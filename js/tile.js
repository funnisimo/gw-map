import { flag as Flag, utils as Utils, color as Color, make as Make, } from "gw-utils";
import { Tile as Flags, TileMech as MechFlags } from "./flags";
import * as TileEvent from "./tileEvent";
import * as Layer from "./layer";
export { Flags, MechFlags };
/** Tile Class */
export class Tile extends Layer.Layer {
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config) {
        super((() => {
            if (!config.Extends)
                return config;
            if (typeof config.Extends === "string") {
                config.Extends = tiles[config.Extends];
                if (!config.Extends)
                    throw new Error("Unknown tile base - " + config.Extends);
            }
            const base = config.Extends;
            config.ch = Utils.first(config.ch, base.sprite.ch, -1);
            config.fg = Utils.first(config.fg, base.sprite.fg, -1);
            config.bg = Utils.first(config.bg, base.sprite.bg, -1);
            config.depth = Utils.first(config.depth, base.depth);
            config.priority = Utils.first(config.priority, base.priority);
            config.opacity = Utils.first(config.opacity, base.sprite.opacity);
            return config;
        })());
        this.flags = { layer: 0, tile: 0, tileMech: 0 };
        this.activates = {};
        this.flavor = null;
        this.desc = null;
        this.article = null;
        this.dissipate = 2000; // 20 * 100 = 20%
        let base = config.Extends;
        if (base) {
            Utils.assignOmitting(["sprite", "depth", "priority", "activates", "flags"], this, base);
            if (base.activates) {
                Object.assign(this.activates, base.activates);
            }
            Object.assign(this.flags, base.flags);
        }
        Utils.assignOmitting([
            "Extends",
            "extends",
            "flags",
            "layerFlags",
            "mechFlags",
            "sprite",
            "activates",
            "ch",
            "fg",
            "bg",
            "opacity",
            "light",
            "depth",
            "priority",
            "flags",
        ], this, config);
        this.name = config.name || (base ? base.name : config.id);
        this.id = config.id;
        // @ts-ignore
        this.flags.tile = Flag.from(Flags, this.flags.tile, config.flags);
        // @ts-ignore
        this.flags.layer = Flag.from(Layer.Flags, this.flags.layer, config.layerFlags || config.flags);
        // @ts-ignore
        this.flags.tileMech = Flag.from(MechFlags, this.flags.tileMech, config.mechFlags || config.flags);
        if (config.activates) {
            Object.entries(config.activates).forEach(([key, info]) => {
                if (info) {
                    const activation = TileEvent.make(info);
                    this.activates[key] = activation;
                }
                else {
                    delete this.activates[key];
                }
            });
        }
    }
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasAllFlags(flag) {
        return (this.flags.tile & flag) === flag;
    }
    hasAllLayerFlags(flag) {
        return (this.flags.layer & flag) === flag;
    }
    hasAllMechFlags(flag) {
        return (this.flags.tileMech & flag) === flag;
    }
    blocksPathing() {
        return (this.flags.layer & Layer.Flags.L_BLOCKS_MOVE ||
            this.flags.tile & Flags.T_PATHING_BLOCKER);
    }
    activatesOn(name) {
        return !!this.activates[name];
    }
    getName(arg) {
        let opts = {};
        if (arg === true || arg === false) {
            opts.article = arg;
        }
        else if (typeof arg === "string") {
            opts.article = arg;
        }
        else if (arg) {
            opts = arg;
        }
        if (!opts.article && !opts.color)
            return this.name;
        let result = this.name;
        if (opts.color) {
            let color = opts.color;
            if (opts.color === true) {
                color = this.sprite.fg || "white";
            }
            if (typeof color !== "string") {
                color = Color.from(color).toString();
            }
            result = `Ω${color}Ω${this.name}∆`;
        }
        if (opts.article) {
            let article = typeof opts.article === "string" ? opts.article : this.article || "a";
            result = article + " " + result;
        }
        return result;
    }
    getDescription(opts = {}) {
        return this.getName(opts);
    }
}
// Types.Tile = Tile;
export function make(config) {
    return new Tile(config);
}
Make.tile = make;
export const tiles = {};
export function install(...args) {
    let id = args[0];
    let base = args[1];
    let config = args[2];
    if (arguments.length == 1) {
        config = args[0];
        config.Extends = config.Extends || null;
        id = config.id;
    }
    else if (arguments.length == 2) {
        config = base;
    }
    if (typeof base === "string") {
        config.Extends = tiles[base] || Utils.ERROR("Unknown base tile: " + base);
    }
    // config.name = config.name || base.name || id.toLowerCase();
    config.id = id;
    const tile = make(config);
    tiles[id] = tile;
    return tile;
}
/**
 * Adds multiple tiles to the GW.tiles collection.
 * It extracts all the id:opts pairs from the config object and uses
 * them to call addTileKind.
 * @param {Object} config - The tiles to add in [id, config] pairs
 * @returns {void} Nothing
 * @see addTileKind
 */
export function installAll(config) {
    Object.entries(config).forEach(([id, opts]) => {
        opts.id = id;
        install(id, opts);
    });
}
