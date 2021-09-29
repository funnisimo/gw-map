import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { ActorKind } from './kind';
import { Item } from '../item';
import { MapType } from '../map';
import * as Memory from '../memory';

export interface PickupOptions {
    admin: boolean;
}

export interface DropOptions {
    admin: boolean;
}

export class Actor extends Entity.Entity {
    // @ts-ignore - initialized in Entity
    flags: ActorFlags;
    kind: ActorKind;
    next: Actor | null = null;
    leader: Actor | null = null;
    items: Item | null = null;
    fov: GWU.fov.FovSystem | null = null;
    memory: Memory.Memory | null = null;

    constructor(kind: ActorKind) {
        super(kind);
        // @ts-ignore - initialized in Entity
        this.flags.actor = 0;
        this.depth = Flags.Depth.ACTOR;
        this.kind = kind;
    }

    hasActorFlag(flag: number) {
        return !!(this.flags.actor & flag);
    }
    hasAllActorFlags(flags: number) {
        return (this.flags.actor & flags) === flags;
    }
    actorFlags(): number {
        return this.flags.actor;
    }

    isPlayer() {
        return this.hasActorFlag(Flags.Actor.IS_PLAYER);
    }

    addToMap(map: MapType, x: number, y: number): boolean {
        if (!super.addToMap(map, x, y)) return false;

        if (this.kind.hasActorFlag(Flags.Actor.HAS_MEMORY)) {
            this.memory = Memory.get(this, map);
        }
        if (this.kind.hasActorFlag(Flags.Actor.USES_FOV)) {
            this.fov = new GWU.fov.FovSystem(map);
            if (this.memory) {
                this.fov.onFovChange = this.memory;
            }
        }
        return true;
    }

    removeFromMap() {
        if (this._map && this.memory) {
            Memory.store(this, this._map, this.memory);
        }
        super.removeFromMap();
    }

    /////////////// VISIBILITY

    canSee(x: number, y: number): boolean;
    canSee(entity: Entity.Entity): boolean;
    canSee(x: number | Entity.Entity, y?: number): boolean {
        if (x instanceof Entity.Entity) {
            return this.canSee(x.x, x.y) && this.kind.isAbleToSee(this, x);
        }
        if (this.fov) {
            return this.fov.isDirectlyVisible(x, y!);
        } else if (this.map) {
            return GWU.xy.forLineBetween(
                this.x,
                this.y,
                x,
                y!,
                (i, j) => !this.map!.cell(i, j).blocksVision()
            );
        } else {
            return false; // need a map or an fov
        }
    }

    canSeeOrSense(x: number, y: number): boolean;
    canSeeOrSense(entity: Entity.Entity): boolean;
    canSeeOrSense(x: number | Entity.Entity, y?: number): boolean {
        if (x instanceof Entity.Entity) {
            return (
                this.canSeeOrSense(x.x, x.y) &&
                (this.kind.isAbleToSee(this, x) ||
                    this.kind.isAbleToSense(this, x))
            );
        }
        if (this.fov) {
            return this.fov.isAnyKindOfVisible(x, y!);
        }
        return this.canSee(x, y!);
    }

    isAbleToSee(entity: Entity.Entity): boolean {
        return this.kind.isAbleToSee(this, entity);
    }

    isAbleToSense(entity: Entity.Entity): boolean {
        return this.kind.isAbleToSense(this, entity);
    }

    ////////////////// INVENTORY

    async pickupItem(
        item: Item,
        opts?: Partial<PickupOptions>
    ): Promise<boolean> {
        return this.kind.pickupItem(this, item, opts);
    }

    async dropItem(item: Item, opts?: Partial<DropOptions>): Promise<boolean> {
        return this.kind.dropItem(this, item, opts);
    }
}
