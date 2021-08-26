import * as Entity from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';

export class Actor extends Entity.Entity {
    flags: ActorFlags;
    next: Actor | null = null;

    constructor(kind: Entity.EntityKind) {
        super(kind);
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.actor = 0;
        this.depth = Flags.Depth.ACTOR;
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
    isVisible() {
        return true;
    }
}
