import * as GWU from 'gw-utils';

import { FlagType, EntityType, KeyInfoType, StatusDrawer } from './types';
import * as Flags from '../flags/entity';
import { CellType, MapType } from '../map/types';
import { EntityKind, TextOptions, FlavorOptions } from './kind';

let lastId = 0;

export class Entity implements EntityType {
    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: Entity | null;
    x: number;
    y: number;
    _map: MapType | null = null;
    kind: EntityKind;
    key: KeyInfoType | null = null;
    machineHome = 0;
    id: string;

    constructor(kind: EntityKind) {
        this.depth = 1; // default - TODO - enum/const
        this.light = null;
        this.flags = { entity: 0 };
        this.next = null;
        this.x = -1;
        this.y = -1;
        this.kind = kind;
        this.id = '' + ++lastId;
    }

    get map(): MapType | null {
        return this._map;
    }

    addToMap(map: MapType, x: number, y: number): boolean {
        if (this.hasEntityFlag(Flags.Entity.L_ON_MAP)) {
            throw new Error('Entity is currently on a map!');
        }
        this.x = x;
        this.y = y;
        this.setEntityFlag(Flags.Entity.L_ON_MAP);
        if (this._map === map) {
            return false;
        }
        this._map = map;
        this.kind.addToMap(this, map);
        return true;
    }

    removeFromMap() {
        this.clearEntityFlag(Flags.Entity.L_ON_MAP);
        this.kind.removeFromMap(this);
    }

    get sprite(): GWU.sprite.Sprite {
        return this.kind.sprite;
    }

    get isDestroyed(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_DESTROYED);
    }

    isAt(x: number, y: number): boolean {
        return this.x === x && this.y === y;
    }

    clone(): this {
        const other: this = new (<new (k: EntityKind) => this>this.constructor)(
            this.kind
        );
        other.copy(this);
        return other;
    }

    copy(other: Entity) {
        this.depth = other.depth;
        this.light = other.light;
        Object.assign(this.flags, other.flags);
        this.next = other.next;
        this.x = other.x;
        this.y = other.y;
        this.kind = other.kind;
        this.id = other.id;
    }

    canBeSeen(): boolean {
        return this.kind.canBeSeen(this);
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
    setEntityFlag(flag: number) {
        this.flags.entity |= flag;
    }
    clearEntityFlag(flag: number) {
        this.flags.entity &= ~flag;
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

    isKey(x: number, y: number) {
        return this.key && this.key.matches(x, y);
    }

    forbidsCell(cell: CellType): boolean {
        return this.kind.forbidsCell(cell, this);
    }

    avoidsCell(cell: CellType): boolean {
        return this.kind.avoidsCell(cell, this);
    }

    getName(opts?: TextOptions): string {
        return this.kind.getName(this, opts);
    }
    getDescription(opts?: TextOptions): string {
        return this.kind.getDescription(this, opts);
    }
    getFlavor(opts?: FlavorOptions): string {
        return this.kind.getFlavor(this, opts);
    }
    getVerb(verb: string): string {
        return this.kind.getVerb(this, verb);
    }

    drawStatus(sidebar: StatusDrawer): void {
        this.kind.drawStatus(this, sidebar);
    }
    drawInto(dest: GWU.sprite.Mixer, _observer?: Entity) {
        dest.drawSprite(this.sprite);
    }

    toString() {
        return `${this.constructor.name}-${this.id} @ ${this.x},${this.y}`;
    }
}
