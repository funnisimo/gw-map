import * as GWU from 'gw-utils';

import { CellType } from '../map/types';
import { Entity } from './entity';

export interface TextOptions {
    article?: boolean;
    color?: boolean | GWU.color.ColorBase;
}

export interface FlavorOptions extends TextOptions {
    action?: boolean;
}

export interface KindOptions extends Partial<GWU.sprite.SpriteConfig> {
    id?: string;
    name: string;
    flavor?: string;
    description?: string;

    tags?: string | string[];
    requiredTileTags?: string | string[];
}

export interface MakeOptions {
    machineHome: number;
}

export class EntityKind {
    id: string;
    name: string;
    flavor: string;
    description: string;
    sprite: GWU.sprite.Sprite;
    tags: string[] = [];
    requiredTileTags: string[] = [];

    constructor(config: KindOptions) {
        this.id = config.id || config.name;
        this.name = config.name;
        this.flavor = config.flavor || this.name;
        this.description = config.description || this.flavor;
        this.sprite = GWU.sprite.make(config);

        if (config.tags) {
            if (typeof config.tags === 'string') {
                this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
            } else {
                this.tags = config.tags.slice();
            }
        }
        if (config.requiredTileTags) {
            if (typeof config.requiredTileTags === 'string') {
                this.requiredTileTags = config.requiredTileTags
                    .split(/[,|]/)
                    .map((t) => t.trim());
            } else {
                this.requiredTileTags = config.requiredTileTags
                    .slice()
                    .map((t) => t.trim());
            }
        }
    }

    make(opts?: Partial<MakeOptions>): Entity {
        const entity = new Entity(this);
        this.init(entity, opts);
        return entity;
    }

    init(entity: Entity, opts: Partial<MakeOptions> = {}) {
        if (opts.machineHome) {
            entity.machineHome = opts.machineHome;
        }
    }

    canBeSeen(_entity: Entity): boolean {
        return true;
    }

    forbidsCell(cell: CellType, _entity?: Entity): boolean {
        if (
            this.requiredTileTags.length &&
            !cell.hasAllTileTags(this.requiredTileTags)
        )
            return true;
        return false;
    }

    avoidsCell(cell: CellType, _entity?: Entity): boolean {
        if (
            this.requiredTileTags.length &&
            !cell.hasAnyTileTag(this.requiredTileTags)
        )
            return true;
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
}
