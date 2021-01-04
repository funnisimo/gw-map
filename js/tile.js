import { flag as Flag, utils as Utils, color as Color, canvas as Canvas, make as Make, } from "gw-utils";
import { Tile as Flags, TileMech as MechFlags, Layer } from "./flags";
import * as TileEvent from "./tileEvent";
import * as Light from "./light";
export { Flags, MechFlags, Layer };
/** Tile Class */
export class Tile extends Canvas.Sprite {
    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config, base) {
        super(Utils.first(config.ch, base === null || base === void 0 ? void 0 : base.ch, -1), Utils.first(config.fg, base === null || base === void 0 ? void 0 : base.fg, -1), Utils.first(config.bg, base === null || base === void 0 ? void 0 : base.bg, -1), Utils.first(config.opacity, base === null || base === void 0 ? void 0 : base.opacity, 100));
        this.flags = 0;
        this.mechFlags = 0;
        this.layer = Layer.GROUND;
        this.priority = -1;
        this.activates = {};
        this.light = null; // TODO - Light
        this.flavor = null;
        this.desc = null;
        this.article = null;
        this.dissipate = 2000; // 20 * 100 = 20%
        if (base !== undefined) {
            Utils.assignOmitting(["activates", "ch", "fg", "bg", "opacity"], this, base);
        }
        Utils.assignOmitting([
            "Extends",
            "extends",
            "flags",
            "mechFlags",
            "sprite",
            "activates",
            "ch",
            "fg",
            "bg",
            "opacity",
            "light",
        ], this, config);
        this.name = config.name || (base ? base.name : config.id);
        this.id = config.id;
        this.layer = this.layer || Layer.GROUND;
        if (typeof this.layer === "string") {
            this.layer = Layer[this.layer];
        }
        if (this.priority < 0) {
            this.priority = 50;
        }
        this.flags = Flag.from(Flags, this.flags, config.flags);
        this.mechFlags = Flag.from(MechFlags, this.mechFlags, config.mechFlags || config.flags);
        if (config.light) {
            // Light.from will throw an Error on invalid config
            this.light = Light.from(config.light);
        }
        if (base && base.activates) {
            Object.assign(this.activates, base.activates);
        }
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
     * Returns the flags for the tile after the given event is fired.
     * @param {string} id - Name of the event to fire.
     * @returns {number} The flags from the Tile after the event.
     */
    successorFlags(id) {
        const e = this.activates[id];
        if (!e)
            return 0;
        const tileId = e.tile;
        if (!tileId)
            return 0;
        const tile = tiles[tileId];
        if (!tile)
            return 0;
        return tile.flags;
    }
    /**
     * Returns whether or not this tile as the given flag.
     * Will return true if any bit in the flag is true, so testing with
     * multiple flags will return true if any of them is set.
     * @param {number} flag - The flag to check
     * @returns {boolean} Whether or not the flag is set
     */
    hasFlag(flag) {
        return (this.flags & flag) > 0;
    }
    hasMechFlag(flag) {
        return (this.mechFlags & flag) > 0;
    }
    hasFlags(flags, mechFlags) {
        return ((!flags || this.flags & flags) &&
            (!mechFlags || this.mechFlags & mechFlags));
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
                color = this.fg;
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
        base = config.Extends || {};
        id = config.id;
    }
    else if (arguments.length == 2) {
        config = base;
        base = config.Extends || config.extends || {};
    }
    if (typeof base === "string") {
        base = tiles[base] || Utils.ERROR("Unknown base tile: " + base);
    }
    // config.name = config.name || base.name || id.toLowerCase();
    config.id = id;
    const tile = new Tile(config, base);
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