import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { ActorKind } from './kind';
import { Item } from '../item';
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
    visionDistance = 99;

    constructor(kind: ActorKind) {
        super(kind);
        // @ts-ignore - initialized in Entity
        this.flags.actor = 0;
        this.depth = Flags.Depth.ACTOR;
        this.kind = kind;
    }

    copy(other: Actor) {
        super.copy(other);
        this.leader = other.leader;
        this.items = other.items;
        this.fov = other.fov;
        this.memory = other.memory;
        this.visionDistance = other.visionDistance;
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
            if (
                GWU.xy.distanceBetween(this.x, this.y, x, y!) >
                this.visionDistance
            ) {
                return false;
            }

            return GWU.xy.forLineBetween(this.x, this.y, x, y!, (i, j) => {
                if (this.map!.cell(i, j).blocksVision()) return false;
            });
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
