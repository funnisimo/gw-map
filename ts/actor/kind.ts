import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import * as Flags from '../flags';
import { Cell, Map } from '../map';
import { Actor, PickupOptions, DropOptions } from './actor';
import { ActorAiFn } from '../ai/ai';
import { Item } from '../item/item';
import { FlavorOptions } from '../entity';
// import * as Memory from '../memory';
import { ActorFlags } from './types';
import * as AI from '../ai';
import * as Action from './action';

export interface KindOptions extends Entity.KindOptions {
    flags?: GWU.flag.FlagBase;
    vision?: number;
    stats?: Record<string, GWU.range.RangeBase>;
    actions?: Record<string, Action.ActorActionBase>;
    moveSpeed?: number; // 100 === normal
    ai?: string | ActorAiFn | AI.AIOptions;
    bump?: Action.ActorActionFn | string | (Action.ActorActionFn | string)[];
    swim?: boolean;
    fly?: boolean;
    waterOnly?: boolean;
    lavaOnly?: boolean;
}

export interface MakeOptions extends Entity.MakeOptions {
    // fov?: GWU.fov.FovSystem;
    // memory?: Memory.Memory;
}

export class ActorKind extends Entity.EntityKind {
    flags: ActorFlags = {
        actor: Flags.Actor.DEFAULT,
        entity: Flags.Entity.DEFAULT_ACTOR,
    };
    vision: Record<string, number> = {};
    stats: Record<string, GWU.range.RangeBase>;
    actions: Record<string, Action.ActorActionBase> = {};
    bump: (Action.ActorActionFn | string)[] = ['attack'];

    moveSpeed = 100;
    ai: AI.AIConfig;

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
        this.stats = Object.assign({ health: 1, morale: 100 }, opts.stats);

        if (opts.actions) {
            Object.assign(this.actions, opts.actions);
        }
        if (opts.moveSpeed) {
            this.moveSpeed = opts.moveSpeed;
        }
        this.ai = AI.make(opts.ai || 'default');
        if (opts.bump) {
            if (typeof opts.bump === 'string') {
                opts.bump = opts.bump.split(/[|,]/g).map((t) => t.trim());
            }
            if (typeof opts.bump === 'function') {
                opts.bump = [opts.bump];
            }
            if (Array.isArray(opts.bump)) {
                this.bump = opts.bump.slice();
            }
        }

        if (opts.waterOnly) {
            this.forbidTileFlags =
                this.forbidTileFlags & ~Flags.Tile.T_IS_DEEP_LIQUID;
            this.avoidTileFlags =
                this.avoidTileFlags & ~Flags.Tile.T_IS_DEEP_LIQUID;
            this.requireTileFlags |= Flags.Tile.T_IS_DEEP_LIQUID;
        } else if (opts.lavaOnly) {
            this.forbidTileFlags = this.forbidTileFlags & ~Flags.Tile.T_LAVA;
            this.avoidTileFlags = this.avoidTileFlags & ~Flags.Tile.T_LAVA;
            this.requireTileFlags |= Flags.Tile.T_LAVA;
        } else {
            if (opts.swim) {
                this.avoidTileFlags |= Flags.Tile.T_IS_DEEP_LIQUID;
            } else {
                this.forbidTileFlags |= Flags.Tile.T_IS_DEEP_LIQUID;
            }

            if (opts.fly) {
                this.forbidTileFlags =
                    this.forbidTileFlags & ~Flags.Tile.T_LAVA;
                this.avoidTileFlags = this.avoidTileFlags & ~Flags.Tile.T_LAVA;
                this.requireTileFlags =
                    this.requireTileFlags & ~Flags.Tile.T_LAVA;

                this.forbidTileFlags =
                    this.forbidTileFlags & ~Flags.Tile.T_IS_DEEP_LIQUID;
                this.avoidTileFlags =
                    this.avoidTileFlags & ~Flags.Tile.T_IS_DEEP_LIQUID;
                this.requireTileFlags =
                    this.requireTileFlags & ~Flags.Tile.T_IS_DEEP_LIQUID;
            }
        }

        this.sidebarFg = GWU.color.from(
            opts.sidebarFg || Actor.default.sidebarFg
        );
    }

    make(options?: Partial<MakeOptions>): Actor {
        const actor = new Actor(this);
        this.init(actor, options);
        return actor;
    }

    init(actor: Actor, options: Partial<MakeOptions> = {}) {
        super.init(actor, options);
        Object.assign(actor.flags, this.flags);
        // if (options.fov) {
        //     actor.fov = options.fov;
        // }
        // if (options.memory) {
        //     actor.memory = options.memory;
        // }
        if (this.vision.normal) {
            actor.visionDistance = this.vision.normal;
        }
        actor.stats.init(this.stats);
    }

    addToMap(actor: Actor, map: Map) {
        super.addToMap(actor, map);
        // if (this.hasActorFlag(Flags.Actor.HAS_MEMORY)) {
        //     actor.memory = Memory.get(actor, map);
        // }
        // if (this.hasActorFlag(Flags.Actor.USES_FOV)) {
        //     actor.fov = new GWU.fov.FovSystem(map);
        //     actor.fov.follow = actor;
        //     if (actor.memory) {
        //         actor.fov.callback = actor.memory;
        //     }
        // }
    }

    removeFromMap(actor: Actor) {
        super.removeFromMap(actor);
        // if (actor._map && actor.memory) {
        //     Memory.store(actor, actor._map, actor.memory);
        // }
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

    forbidsCell(cell: Cell, actor?: Actor): boolean {
        if (super.forbidsCell(cell, actor)) {
            return true;
        }

        if (cell.blocksMove()) return true;
        return false;
    }

    avoidsCell(cell: Cell, actor?: Actor): boolean {
        if (super.avoidsCell(cell, actor)) return true;
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

    pickupItem(
        actor: Actor,
        item: Item,
        _opts?: Partial<PickupOptions>
    ): boolean {
        if (!GWU.list.push(actor, 'items', item)) return false;
        // TODO - Pickup effects
        return true;
    }

    dropItem(actor: Actor, item: Item, _opts?: Partial<DropOptions>): boolean {
        if (!GWU.list.remove(actor, 'items', item)) return false;
        // TODO - Drop effects
        return true;
    }

    cellCost(cell: Cell, actor: Actor): number {
        if (this.forbidsCell(cell, actor)) {
            return cell.hasEntityFlag(Flags.Entity.L_BLOCKS_DIAGONAL)
                ? GWU.path.OBSTRUCTION
                : GWU.path.FORBIDDEN;
        } else if (this.avoidsCell(cell, actor)) {
            return GWU.path.AVOIDED;
        }
        return GWU.path.OK;
    }
}
