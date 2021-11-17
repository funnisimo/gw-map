import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import * as Flags from '../flags';
import { CellType, MapType } from '../map';
import { Actor, PickupOptions, DropOptions } from './actor';
import { Item } from '../item/item';
import { FlavorOptions } from '../entity';
import * as Memory from '../memory';
import { ActorFlags } from '.';

export interface KindOptions extends Entity.KindOptions {
    flags?: GWU.flag.FlagBase;
    vision?: number;
}

export interface MakeOptions extends Entity.MakeOptions {
    fov?: GWU.fov.FovSystem;
    memory?: Memory.Memory;
}

export class ActorKind extends Entity.EntityKind {
    flags: ActorFlags = {
        actor: Flags.Actor.DEFAULT,
        entity: Flags.Entity.DEFAULT_ACTOR,
    };
    vision: Record<string, number> = {};

    constructor(opts: KindOptions) {
        super(opts);
        if (opts.flags) {
            this.flags.actor = GWU.flag.from(
                Flags.Actor,
                this.flags.actor,
                opts.flags
            );
            this.flags.entity = GWU.flag.from(
                Flags.Entity,
                this.flags.entity,
                opts.flags
            );
        }
        if (opts.vision) {
            this.vision.normal = opts.vision;
        }
    }

    make(options?: Partial<MakeOptions>): Actor {
        const actor = new Actor(this);
        this.init(actor, options);
        return actor;
    }

    init(actor: Actor, options: Partial<MakeOptions> = {}) {
        super.init(actor, options);
        Object.assign(actor.flags, this.flags);
        if (options.fov) {
            actor.fov = options.fov;
        }
        if (options.memory) {
            actor.memory = options.memory;
        }
        if (this.vision.normal) {
            actor.visionDistance = this.vision.normal;
        }
    }

    addToMap(actor: Actor, map: MapType) {
        super.addToMap(actor, map);
        if (this.hasActorFlag(Flags.Actor.HAS_MEMORY)) {
            actor.memory = Memory.get(actor, map);
        }
        if (this.hasActorFlag(Flags.Actor.USES_FOV)) {
            actor.fov = new GWU.fov.FovSystem(map);
            actor.fov.follow = actor;
            if (actor.memory) {
                actor.fov.callback = actor.memory;
            }
        }
    }

    removeFromMap(actor: Actor) {
        super.removeFromMap(actor);
        if (actor._map && actor.memory) {
            Memory.store(actor, actor._map, actor.memory);
        }
    }

    hasActorFlag(flag: number): boolean {
        return !!(this.flags.actor & flag);
    }

    canSeeEntity(_actor: Actor, _entity: Entity.Entity): boolean {
        return true;
    }

    isAbleToSee(_actor: Actor, _entity: Entity.Entity): boolean {
        return true;
    }

    isAbleToSense(_actor: Actor, _entity: Entity.Entity): boolean {
        return true;
    }

    forbidsCell(cell: CellType, actor?: Actor): boolean {
        if (super.forbidsCell(cell, actor)) return true;
        if (cell.blocksMove()) return true;
        return false;
    }

    avoidsCell(cell: CellType, actor?: Actor): boolean {
        if (super.avoidsCell(cell, actor)) return true;
        if (cell.blocksMove()) return true;
        if (cell.blocksPathing()) return true;
        return false;
    }

    getFlavor(actor: Actor, opts?: FlavorOptions): string {
        const flavor = actor.isPlayer() ? 'yourself' : this.flavor;
        if (opts && opts.action) {
            return flavor + ' standing';
        }
        return flavor;
    }

    async pickupItem(
        actor: Actor,
        item: Item,
        _opts?: Partial<PickupOptions>
    ): Promise<boolean> {
        if (!GWU.list.push(actor, 'items', item)) return false;
        // TODO - Pickup effects
        return true;
    }

    async dropItem(
        actor: Actor,
        item: Item,
        _opts?: Partial<DropOptions>
    ): Promise<boolean> {
        if (!GWU.list.remove(actor, 'items', item)) return false;
        // TODO - Drop effects
        return true;
    }
}
