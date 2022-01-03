import * as GWU from 'gw-utils';

import { Cell, Map } from '../map';
import { Entity } from './entity';
import * as Flags from '../flags';

export interface TextOptions {
    article?: boolean;
    color?: boolean | GWU.color.ColorBase;
}

export interface FlavorOptions extends TextOptions {
    action?: boolean;
}

export interface KindOptions extends GWU.sprite.SpriteConfig {
    id?: string;
    name: string;
    flavor?: string;
    description?: string;

    sprite?: GWU.sprite.SpriteConfig;

    tags?: string | string[];
    requireTileFlags?: GWU.flag.FlagBase;
    avoidTileFlags?: GWU.flag.FlagBase;
    forbidTileFlags?: GWU.flag.FlagBase;

    requireTileTags?: string | string[];
    avoidTileTags?: string | string[];
    forbidTileTags?: string | string[];
}

export interface MakeOptions {
    machineHome?: number;
    x?: number;
    y?: number;
}

export class EntityKind {
    id: string;
    name: string;
    flavor: string;
    description: string;
    sprite: GWU.sprite.Sprite;
    tags: string[] = [];

    requireTileFlags = 0;
    forbidTileFlags = 0;
    avoidTileFlags = 0;

    requireTileTags: string[] = [];
    forbidTileTags: string[] = [];
    avoidTileTags: string[] = [];

    constructor(config: KindOptions) {
        this.id = config.id || config.name;
        this.name = config.name;
        this.flavor = config.flavor || this.name;
        this.description = config.description || this.flavor;
        this.sprite = GWU.sprite.make(config.sprite ? config.sprite : config);

        if (config.tags) {
            if (typeof config.tags === 'string') {
                this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
            } else {
                this.tags = config.tags.slice();
            }
        }
        if (config.requireTileFlags) {
            this.requireTileFlags = GWU.flag.from(
                Flags.Tile,
                config.requireTileFlags
            );
        }
        if (config.avoidTileFlags) {
            this.avoidTileFlags = GWU.flag.from(
                Flags.Tile,
                config.avoidTileFlags
            );
        }
        if (config.forbidTileFlags) {
            this.forbidTileFlags = GWU.flag.from(
                Flags.Tile,
                config.forbidTileFlags
            );
        }

        if (config.requireTileTags) {
            if (typeof config.requireTileTags === 'string') {
                config.requireTileTags = config.requireTileTags.split(/[,|]/g);
            }
            this.requireTileTags = config.requireTileTags.map((t) => t.trim());
        }
        if (config.avoidTileTags) {
            if (typeof config.avoidTileTags === 'string') {
                config.avoidTileTags = config.avoidTileTags.split(/[,|]/g);
            }
            this.avoidTileTags = config.avoidTileTags.map((t) => t.trim());
        }
        if (config.forbidTileTags) {
            if (typeof config.forbidTileTags === 'string') {
                config.forbidTileTags = config.forbidTileTags.split(/[,|]/g);
            }
            this.forbidTileTags = config.forbidTileTags.map((t) => t.trim());
        }
    }

    make(opts?: MakeOptions): Entity {
        const entity = new Entity(this);
        this.init(entity, opts);
        return entity;
    }

    init(entity: Entity, opts: MakeOptions = {}) {
        if (opts.machineHome) {
            entity.machineHome = opts.machineHome;
        }
    }

    addToMap(_entity: Entity, _map: Map) {}
    removeFromMap(_entity: Entity) {}

    canBeSeen(_entity: Entity): boolean {
        return true;
    }

    forbidsCell(cell: Cell, _entity?: Entity): boolean {
        if (
            this.requireTileFlags &&
            !cell.hasAllTileFlags(this.requireTileFlags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }
        if (
            this.forbidTileFlags &&
            cell.hasTileFlag(this.forbidTileFlags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }

        if (
            this.requireTileTags.length &&
            !cell.hasAllTileTags(this.requireTileTags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }
        if (
            this.forbidTileTags.length &&
            cell.hasAnyTileTag(this.forbidTileTags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }

        return false;
    }

    avoidsCell(cell: Cell, entity?: Entity): boolean {
        if (this.forbidsCell(cell, entity)) return true;
        if (
            this.avoidTileFlags &&
            cell.hasTileFlag(this.avoidTileFlags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }

        if (
            this.avoidTileTags.length &&
            cell.hasAnyTileTag(this.avoidTileTags) &&
            !cell.hasTileFlag(Flags.Tile.T_BRIDGE)
        ) {
            return true;
        }
        return false;
    }

    getName(_entity: Entity, _opts?: TextOptions): string {
        return this.name;
    }
    getDescription(_entity: Entity, _opts?: TextOptions): string {
        return this.description;
    }
    getFlavor(_entity: Entity, _opts?: FlavorOptions): string {
        return this.flavor;
    }
    getVerb(_entity: Entity, verb: string): string {
        return verb;
    }

    drawStatus(
        entity: Entity,
        buffer: GWU.buffer.Buffer,
        bounds: GWU.xy.Bounds
    ): number {
        if (!entity.map) return 0;
        if (entity.isDestroyed) return 0;

        const mixer = new GWU.sprite.Mixer();

        entity.map.getAppearanceAt(entity.x, entity.y, mixer);

        buffer.drawSprite(bounds.x + 1, bounds.y, mixer);
        buffer.wrapText(
            bounds.x + 3,
            bounds.y,
            bounds.width - 3,
            entity.getName(),
            'purple'
        );
        return 1;
    }
}

export function make(opts: KindOptions, makeOpts: MakeOptions = {}): Entity {
    const kind = new EntityKind(opts);
    return kind.make(makeOpts);
}
