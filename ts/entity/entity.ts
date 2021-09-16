import * as GWU from 'gw-utils';

import { FlagType, EntityType, KeyInfoType } from './types';
import * as Flags from '../flags/entity';
import { CellType, MapType } from '../map/types';
import { EntityKind } from './kind';

export class Entity implements EntityType {
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: Entity | null;
    x: number;
    y: number;
    map: MapType | null = null;
    kind: EntityKind;
    key: KeyInfoType | null = null;
    machineHome = 0;

    constructor(kind: EntityKind) {
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { entity: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
        this.kind = kind;
    }

    get sprite(): GWU.sprite.Sprite {
        return this.kind.sprite;
    }

    get isDestroyed(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_DESTROYED);
    }

    destroy() {
        this.flags.entity |= Flags.Entity.L_DESTROYED;
    }

    hasEntityFlag(flag: number) {
        return !!(this.flags.entity & flag);
    }
    hasAllEntityFlags(flags: number) {
        return (this.flags.entity & flags) === flags;
    }

    hasTag(tag: string): boolean {
        return this.kind.tags.includes(tag);
    }

    blocksMove(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_BLOCKS_MOVE);
    }
    blocksVision(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_BLOCKS_VISION);
    }
    blocksPathing(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_BLOCKS_MOVE);
    }
    blocksEffects(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_BLOCKS_EFFECTS);
    }

    forbidsCell(cell: CellType): boolean {
        return this.kind.forbidsCell(cell, this);
    }

    avoidsCell(cell: CellType): boolean {
        return this.kind.avoidsCell(cell, this);
    }

    getName(): string {
        return this.kind.getName(this);
    }
    getDescription(): string {
        return this.kind.getDescription(this);
    }
    getFlavor(): string {
        return this.kind.getFlavor(this);
    }
    getVerb(verb: string): string {
        return this.kind.getVerb(this, verb);
    }
}
