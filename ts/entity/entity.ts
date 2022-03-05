import * as GWU from 'gw-utils';

import { FlagType, EntityType, KeyInfoType } from './types';
import * as Flags from '../flags/entity';
import { Cell } from '../map/cell';
import { Map } from '../map/map';
import { EntityKind, TextOptions, FlavorOptions } from './kind';
import * as ACTION from '../action';

let lastId = 0;

export type ActorActionResult = false | ACTION.ActionFn;

export class Entity implements EntityType {
    static default = {
        sidebarFg: 'purple',
    };

    depth: number;
    light: GWU.light.LightType | null;
    flags: FlagType;
    next: Entity | null;
    x: number;
    y: number;
    _map: Map | null = null;
    kind: EntityKind;
    key: KeyInfoType | null = null;
    machineHome = 0;
    id: string;
    changed = true;

    actions = new ACTION.Actions(this);
    _actions: Record<string, boolean> = {};

    // lastSeen: GWU.xy.Loc = [-1, -1];

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

    get map(): Map | null {
        return this._map;
    }

    isPlural(): boolean {
        return this.hasEntityFlag(Flags.Entity.L_ALWAYS_PLURAL);
    }

    isOnMap(): boolean {
        // return this.hasEntityFlag(Flags.Entity.L_ON_MAP);
        return !!this._map;
    }

    addToMap(map: Map, x: number, y: number): boolean {
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

    forbidsCell(cell: Cell): boolean {
        return this.kind.forbidsCell(cell, this);
    }

    avoidsCell(cell: Cell): boolean {
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

    drawSidebar(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        return this.kind.drawSidebar(this, buffer, bounds);
    }
    drawInto(dest: GWU.sprite.Mixer, _observer?: Entity) {
        dest.drawSprite(this.sprite);
    }

    canDoAction(action: string): boolean {
        const v = this._actions[action];
        if (v !== undefined) return v;
        return this.kind.canDoAction(action);
    }

    hasAction(action: string): boolean {
        return this.actions.has(action) || this.kind.actions.has(action);
    }

    on(action: string | string[], fn: ACTION.ActionFn) {
        this.actions.on(action, fn);
    }
    once(action: string | string[], fn: ACTION.ActionFn) {
        this.actions.once(action, fn);
    }
    off(action: string | string[], fn?: ACTION.ActionFn) {
        this.actions.off(action, fn);
    }

    trigger(name: string, action: ACTION.Action | ACTION.ActionObj = {}): void {
        if (!(action instanceof ACTION.Action)) {
            action = new ACTION.Action(action);
        }

        if (action.isDone()) return;
        this.actions.trigger(name, action);
        if (action.isDone()) return;
        this.kind.trigger(name, action);
    }

    toString() {
        return `${this.kind.id}-${this.id} @ ${this.x},${this.y}`;
    }
}
