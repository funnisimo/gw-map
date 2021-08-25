import { Entity } from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { CellType } from '../map/types';

export class Actor extends Entity {
    flags: ActorFlags;
    next: Actor | null = null;

    constructor() {
        super();
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

    forbidsCell(_cell: CellType): boolean {
        return false;
    }

    getName(): string {
        return '';
    }
    getDescription(): string {
        return '';
    }
    getFlavor(): string {
        return '';
    }
}
