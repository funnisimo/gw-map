import {
    flag as Flag,
    utils as Utils,
    color as Color,
    types as Types,
    make as Make,
    effect as Effect,
} from 'gw-utils';

import { Tile as Flags, TileMech as MechFlags } from './flags';
import * as Layer from './entity';

export { Flags, MechFlags };

export interface NameConfig {
    article?: boolean | string;
    color?: boolean | string | Color.ColorBase;
}

// export type TileBase = TileConfig | string;

export interface FullTileConfig extends Layer.EntityConfig {
    Extends: string | Tile;

    flags: number | string | any[];
    mechFlags: number | string | any[];
    priority: number;

    activates: any;

    flavor: string;
    desc: string;
    name: string;
    article: string;
    id: string;
    ground: string;

    dissipate: number; // 20 * 100 = 20%
}

declare type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type TileConfig = AtLeast<FullTileConfig, 'id'>;

/** Tile Class */
export class Tile extends Layer.Entity implements Types.TileType {
    public name: string;
    public flags: Types.TileFlags = { layer: 0, tile: 0, tileMech: 0 };

    public activates: Record<string, Effect.Effect | string> = {};

    public flavor: string | null = null;
    public desc: string | null = null;
    public article: string | null = null;
    public id: string;

    public dissipate = 2000; // 20 * 100 = 20%
    public defaultGround: string | null = null;

    /**
     * Creates a new Tile object.
     * @param {Object} [config={}] - The configuration of the Tile
     * @param {String|Number|String[]} [config.flags=0] - Flags and MechFlags for the tile
     * @param {String} [config.layer=GROUND] - Name of the layer for this tile
     * @param {String} [config.ch] - The sprite character
     * @param {String} [config.fg] - The sprite foreground color
     * @param {String} [config.bg] - The sprite background color
     */
    constructor(config: TileConfig) {
        super(
            (() => {
                if (!config.Extends) return config;

                if (typeof config.Extends === 'string') {
                    config.Extends = tiles[config.Extends];
                    if (!config.Extends)
                        throw new Error(
                            'Unknown tile base - ' + config.Extends
                        );
                }
                const base = config.Extends;

                config.ch = Utils.first(config.ch, base.sprite.ch, -1);
                config.fg = Utils.first(config.fg, base.sprite.fg, -1);
                config.bg = Utils.first(config.bg, base.sprite.bg, -1);
                config.layer = Utils.first(config.layer, base.layer);
                config.priority = Utils.first(config.priority, base.priority);
                config.opacity = Utils.first(
                    config.opacity,
                    base.sprite.opacity
                );
                config.light = Utils.first(config.light, base.light);
                return config;
            })()
        );
        let base: Tile = config.Extends as Tile;
        if (base) {
            Utils.assignOmitting(
                ['sprite', 'depth', 'priority', 'activates', 'flags', 'light'],
                this,
                base
            );
            if (base.activates) {
                Object.assign(this.activates, base.activates);
            }
            Object.assign(this.flags, base.flags);
        }
        Utils.assignOmitting(
            [
                'Extends',
                'extends',
                'flags',
                'layerFlags',
                'mechFlags',
                'sprite',
                'activates',
                'ch',
                'fg',
                'bg',
                'opacity',
                'light',
                'layer',
                'priority',
                'flags',
                'ground',
                'light',
            ],
            this,
            config
        );
        this.name = config.name || (base ? base.name : config.id);
        this.id = config.id;
        if (config.ground) {
            this.defaultGround = config.ground;
        }

        // @ts-ignore
        this.flags.tile = Flag.from(Flags, this.flags.tile, config.flags);
        // @ts-ignore
        this.flags.layer = Flag.from(
            Layer.Flags,
            this.flags.layer,
            config.layerFlags || config.flags
        );
        // @ts-ignore
        this.flags.tileMech = Flag.from(
            MechFlags,
            this.flags.tileMech,
            config.mechFlags || config.flags
        );

        if (config.activates) {
            Object.entries(config.activates).forEach(([key, info]) => {
                if (info) {
                    if (typeof info === 'string') {
                        if (tiles[info]) {
                            info = { tile: info };
                        } else {
                            this.activates[key] = info;
                            return;
                        }
                    }
                    const activation = Effect.make(info)!;
                    this.activates[key] = activation;
                } else {
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
    hasAllFlags(flag: number): boolean {
        return (this.flags.tile & flag) === flag;
    }

    hasAllLayerFlags(flag: number) {
        return (this.flags.layer & flag) === flag;
    }

    hasAllMechFlags(flag: number) {
        return (this.flags.tileMech & flag) === flag;
    }

    blocksPathing() {
        return (
            this.flags.layer & Layer.Flags.L_BLOCKS_MOVE ||
            this.flags.tile & Flags.T_PATHING_BLOCKER
        );
    }

    activatesOn(name: string) {
        return !!this.activates[name];
    }

    getName(): string;
    getName(opts: NameConfig): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getName(arg?: any) {
        let opts: NameConfig = {};
        if (arg === true || arg === false) {
            opts.article = arg;
        } else if (typeof arg === 'string') {
            opts.article = arg;
        } else if (arg) {
            opts = arg;
        }

        if (!opts.article && !opts.color) return this.name;

        let result = this.name;
        if (opts.color) {
            let color: Color.ColorBase = opts.color as Color.ColorBase;
            if (opts.color === true) {
                color = this.sprite.fg || 'white';
            }
            if (typeof color !== 'string') {
                color = Color.from(color).toString();
            }
            result = `Ω${color}Ω${this.name}∆`;
        }

        if (opts.article) {
            let article =
                typeof opts.article === 'string'
                    ? opts.article
                    : this.article || 'a';
            result = article + ' ' + result;
        }
        return result;
    }

    getDescription(opts: any = {}) {
        return this.getName(opts);
    }

    //   getFlavor() {
    //     return this.flavor || this.getName(true);
    //   }

    //   async applyInstantEffects(map, x, y, cell) {
    //     const actor = cell.actor;
    //     const isPlayer = actor ? actor.isPlayer() : false;

    //     if (this.flags & Flags.Tile.T_LAVA && actor) {
    //       if (!cell.hasTileFlag(Flags.Tile.T_BRIDGE) && !actor.status.levitating) {
    //         actor.kill();
    //         await Game.gameOver(false, "ΩredΩyou fall into lava and perish.");
    //         return true;
    //       }
    //     }

    //     return false;
    //   }
}

// Types.Tile = Tile;

export function make(config: TileConfig) {
    return new Tile(config);
}

Make.tile = make;

export const tiles: Record<string, Tile> = {};

/**
 * Adds a new Tile into the GW.tiles collection.
 * @param {String} [id] - The identifier for this Tile
 * @param {Tile|string} [base] - The base tile from which to extend (id or object)
 * @param {Object} config - The tile configuration
 * @returns {Tile} The newly created tile
 */
export function install(
    id: string,
    base: string | Tile,
    config: Partial<TileConfig>
): Tile;
export function install(id: string, config: Partial<TileConfig>): Tile;
export function install(config: TileConfig): Tile;
export function install(...args: any[]) {
    let id = args[0];
    let base = args[1];
    let config = args[2];

    if (arguments.length == 1) {
        config = args[0];
        base = config.Extends || null;
        id = config.id;
    } else if (arguments.length == 2) {
        config = base;
    }

    if (typeof base === 'string') {
        config.Extends =
            tiles[base] || Utils.ERROR('Unknown base tile: ' + base);
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
export function installAll(config: Record<string, Partial<TileConfig>>): void {
    Object.entries(config).forEach(([id, opts]) => {
        opts.id = id;
        install(id, opts);
    });
}
