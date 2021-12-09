import * as GWU from 'gw-utils';

import { EffectBase, Effect, make as makeEffect } from '../effect/effect';
import { TileFlags } from './types';
import * as Flags from '../flags';

export interface TextOptions {
    article?: boolean | string;
    color?: boolean | string | GWU.color.ColorBase;
}

export interface TileConfig extends GWU.sprite.SpriteConfig {
    id: string;
    flags: TileFlags;
    dissipate: number;
    effects: Record<string, EffectBase | Effect>;
    priority: number;
    depth: number;
    light: GWU.light.LightType | null;
    groundTile: string | null;

    name: string;
    description: string;
    flavor: string;
    article: string | null;
    tags: string | string[] | null;
}

export class Tile {
    id: string;
    index = -1;
    flags: TileFlags;
    dissipate = 20 * 100; // 0%
    effects: Record<string, string | Effect> = {};
    sprite: GWU.sprite.Sprite;
    priority = 50;
    depth = 0;
    light: GWU.light.LightType | null = null;
    groundTile: string | null = null;
    tags: string[] = [];

    name: string;
    description: string;
    flavor: string;
    article: string | null;

    constructor(config: Partial<TileConfig>) {
        this.id = config.id || 'n/a';
        this.dissipate = config.dissipate ?? this.dissipate;
        this.priority = config.priority ?? this.priority;
        this.depth = config.depth ?? this.depth;
        this.light = config.light || null;
        this.groundTile = config.groundTile || null;

        this.sprite = GWU.sprite.make(config);
        this.name = config.name || 'tile';
        this.description = config.description || this.name;
        this.flavor = config.flavor || this.name;
        this.article = config.article ?? null;

        this.flags = config.flags || { entity: 0, tile: 0, tileMech: 0 };

        if (config.effects) {
            Object.assign(this.effects, config.effects);
        }

        if (this.hasEffect('fire')) {
            this.flags.tile |= Flags.Tile.T_IS_FLAMMABLE;
        }

        if (config.tags) {
            if (typeof config.tags === 'string') {
                config.tags
                    .split(/[,|]/)
                    .map((t) => t.trim())
                    .forEach((t) => {
                        this.tags.push(t);
                    });
            } else {
                this.tags = config.tags.slice().map((t) => t.trim());
            }
        }
    }

    hasTag(tag: string) {
        return this.tags.includes(tag);
    }
    hasAnyTag(tags: string[]) {
        return GWU.arraysIntersect(this.tags, tags);
    }
    hasAllTags(tags: string[]) {
        return tags.every((t) => this.tags.includes(t));
    }

    hasEntityFlag(flag: number): boolean {
        return !!(this.flags.entity & flag);
    }
    hasTileFlag(flag: number): boolean {
        return !!(this.flags.tile & flag);
    }
    hasTileMechFlag(flag: number): boolean {
        return !!(this.flags.tileMech & flag);
    }

    hasAllEntityFlags(flag: number): boolean {
        return (this.flags.entity & flag) === flag;
    }
    hasAllTileFlags(flag: number): boolean {
        return (this.flags.tile & flag) === flag;
    }
    hasAllTileMechFlags(flag: number): boolean {
        return (this.flags.tileMech & flag) === flag;
    }

    blocksVision(): boolean {
        return !!(this.flags.entity & Flags.Entity.L_BLOCKS_VISION);
    }
    blocksMove(): boolean {
        return !!(this.flags.entity & Flags.Entity.L_BLOCKS_MOVE);
    }
    blocksPathing(): boolean {
        return (
            this.blocksMove() || this.hasTileFlag(Flags.Tile.T_PATHING_BLOCKER)
        );
    }
    blocksEffects(): boolean {
        return !!(this.flags.entity & Flags.Entity.L_BLOCKS_EFFECTS);
    }

    hasEffect(name: string): boolean {
        return name in this.effects;
    }

    getName(): string;
    getName(config?: TextOptions): string;
    getName(article: string): string;
    getName(article: boolean): string;
    getName(arg?: boolean | string | TextOptions): string {
        let opts: TextOptions = {};
        if (typeof arg === 'boolean') {
            opts.article = arg;
        } else if (typeof arg === 'string') {
            opts.article = arg;
        } else if (arg) {
            opts = arg;
        }

        if (!opts.article && !opts.color) return this.name;

        let result = this.name;
        if (opts.color) {
            let color: GWU.color.ColorBase = opts.color as GWU.color.ColorBase;
            if (opts.color === true) {
                color = this.sprite.fg || 'white';
            }
            if (typeof color !== 'string') {
                color = GWU.color.from(color).toString();
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
    getDescription(opts?: TextOptions): string {
        return this.description || this.getName(opts);
    }
    getFlavor(opts?: TextOptions): string {
        return this.flavor || this.getName(opts);
    }
}

export interface TileOptions extends GWU.sprite.SpriteConfig {
    extends: string;

    id: string;
    name: string;
    description: string;
    flavor: string;
    article: string;

    flags: GWU.flag.FlagBase;
    priority: number | string;
    dissipate: number;
    depth: Flags.Depth | Flags.DepthString;

    effects: Record<string, EffectBase | null>;
    groundTile: string;

    light: GWU.light.LightBase | null;

    tags: string | string[];
}

export function make(options: Partial<TileOptions>) {
    let base = { effects: {}, flags: {}, sprite: {}, priority: 50 } as Tile;
    if (options.extends) {
        base = tiles[options.extends];
        if (!base)
            throw new Error('Failed to find base tile: ' + options.extends);
    }

    let priority: number = base.priority;
    if (typeof options.priority === 'string') {
        let text = options.priority.replace(/ /g, '');
        let index = text.search(/[+-]/);
        if (index == 0) {
            priority = base.priority + Number.parseInt(text);
        } else if (index == -1) {
            if (text.search(/[a-zA-Z]/) == 0) {
                const tile = tiles[text];
                if (!tile)
                    throw new Error(
                        'Failed to find tile for priority - ' + text + '.'
                    );
                priority = tile.priority;
            } else {
                priority = Number.parseInt(text);
            }
        } else {
            const id = text.substring(0, index);
            const delta = Number.parseInt(text.substring(index));
            const tile = tiles[id];
            if (!tile)
                throw new Error(
                    'Failed to find tile for priority - ' + id + '.'
                );

            priority = tile.priority + delta;
        }
    } else if (options.priority !== undefined) {
        priority = options.priority;
    }

    const effects: Record<string, Effect | string> = {};
    Object.assign(effects, base.effects);
    if (options.effects) {
        Object.entries(options.effects).forEach(([key, value]) => {
            if (value === null) {
                delete effects[key];
                return;
            }

            if (typeof value === 'string' && !value.includes(':')) {
                effects[key] = value;
                return;
            }

            try {
                effects[key] = makeEffect(value);
            } catch (e: any) {
                throw new Error(
                    `Failed to add effect to tile => ${key} : ${JSON.stringify(
                        value
                    )} : ` + (e as Error).message
                );
            }
        });
    }

    const flags: TileFlags = {
        entity: GWU.flag.from(Flags.Entity, base.flags.entity, options.flags),
        tile: GWU.flag.from(Flags.Tile, base.flags.tile, options.flags),
        tileMech: GWU.flag.from(
            Flags.TileMech,
            base.flags.tileMech,
            options.flags
        ),
    };

    let depth: number = base.depth || 0;
    if (options.depth) {
        if (typeof options.depth === 'string') {
            depth = Flags.Depth[options.depth];
        } else {
            depth = options.depth;
        }
    }
    let light = base.light;
    if (options.light) {
        light = GWU.light.make(options.light);
    } else if (options.light === null) {
        light = null;
    }

    const config: Partial<TileConfig> = {
        id: options.id,
        flags,
        dissipate: options.dissipate ?? base.dissipate,
        effects,
        priority,
        depth: depth,
        light,
        groundTile: options.groundTile || null,

        ch: options.ch ?? base.sprite.ch,
        fg: options.fg ?? base.sprite.fg,
        bg: options.bg ?? base.sprite.bg,
        opacity: options.opacity ?? base.sprite.opacity,

        name: options.name || base.name,
        description: options.description || base.description,
        flavor: options.flavor || base.flavor,
        article: options.article ?? base.article,
        tags: options.tags || null,
    };

    const tile = new Tile(config);
    return tile;
}

export const tiles: Record<string, Tile> = {};
export const all: Tile[] = [];

export function get(id: string | number | Tile): Tile {
    if (id instanceof Tile) return id;
    if (typeof id === 'string') return tiles[id] || null;
    return all[id] || null;
}

export function install(id: string, options: Partial<TileOptions>): Tile;
export function install(
    id: string,
    base: string,
    options: Partial<TileOptions>
): Tile;
export function install(id: string, ...args: any[]): Tile {
    let options: Partial<TileOptions> = args[0];
    if (args.length == 2) {
        options = args[1];
        options.extends = args[0];
    }
    options.id = id;
    const tile = make(options);
    tile.index = all.length;
    all.push(tile);
    tiles[id] = tile;
    return tile;
}

export function installAll(tiles: Record<string, Partial<TileOptions>>): void {
    Object.entries(tiles).forEach(([id, config]) => {
        install(id, config);
    });
}
