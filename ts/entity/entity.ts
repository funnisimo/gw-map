import * as GWU from 'gw-utils';

import { FlagType, EntityType } from './types';
import * as Flags from '../flags/entity';

export abstract class Entity implements EntityType {
    sprite: GWU.sprite.Sprite;
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: Entity | null;
    x: number;
    y: number;

    constructor() {
        this.sprite = new GWU.sprite.Sprite();
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { entity: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
    }

    hasObjectFlag(flag: number) {
        return !!(this.flags.entity & flag);
    }
    hasAllObjectFlags(flags: number) {
        return (this.flags.entity & flags) === flags;
    }

    blocksMove(): boolean {
        return this.hasObjectFlag(Flags.Entity.L_BLOCKS_MOVE);
    }
    blocksVision(): boolean {
        return this.hasObjectFlag(Flags.Entity.L_BLOCKS_VISION);
    }
    blocksPathing(): boolean {
        return this.hasObjectFlag(Flags.Entity.L_BLOCKS_MOVE);
    }
    blocksEffects(): boolean {
        return this.hasObjectFlag(Flags.Entity.L_BLOCKS_EFFECTS);
    }

    abstract getName(): string;
    abstract getDescription(): string;
    abstract getFlavor(): string;
}
