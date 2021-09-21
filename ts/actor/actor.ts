import * as Entity from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { ActorKind } from './kind';
import { Item } from '../item';

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
    hasStatus(_status: string): boolean {
        return false;
    }

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
