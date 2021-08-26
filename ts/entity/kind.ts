import * as GWU from 'gw-utils';

import { CellType } from '../map/types';
import { Entity } from './entity';

export interface KindOptions extends Partial<GWU.sprite.SpriteConfig> {
    name: string;
    flavor?: string;
    description?: string;

    tags?: string | string[];
}

export class EntityKind {
    name: string;
    flavor: string;
    description: string;
    sprite: GWU.sprite.Sprite;
    tags: string[] = [];

    constructor(config: KindOptions) {
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
    }

    forbidsCell(_item: Entity, _cell: CellType): boolean {
        return false;
    }

    getName(_item: Entity): string {
        return this.name;
    }
    getDescription(_item: Entity): string {
        return this.description;
    }
    getFlavor(_item: Entity): string {
        return this.flavor;
    }
    getVerb(_item: Entity, verb: string): string {
        return verb;
    }
}
