import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { ActorKind } from './kind';
import { ActorActionFn, getAction, ActorActionResult } from './action';
import { Item } from '../item';
import * as Memory from '../memory';
import { Status } from './status';
import { Stats } from './stat';
import { Game } from '../game';
import { AIConfig } from '../ai/ai';
import { MapType } from '../map/types';

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
    ai: AIConfig | null = null;

    leader: Actor | null = null;
    items: Item | null = null; // inventory

    fov: GWU.fov.FovSystem | null = null;
    memory: Memory.Memory | null = null;
    visionDistance = 99;
    stats: Stats;
    status: Status;

    data: Record<string, number> = {};
    _costMap: GWU.grid.NumGrid | null = null;
    _goalMap: GWU.grid.NumGrid | null = null;

    next: Actor | null = null; // TODO - can we get rid of this?

    constructor(kind: ActorKind) {
        super(kind);
        // @ts-ignore - initialized in Entity
        this.flags.actor = 0;
        this.depth = Flags.Depth.ACTOR;
        this.kind = kind;
        this.stats = new Stats();
        this.status = new Status();
    }

    copy(other: Actor) {
        super.copy(other);
        this.leader = other.leader;
        this.items = other.items;
        this.fov = other.fov;
        this.memory = other.memory;
        this.visionDistance = other.visionDistance;
    }

    destroy() {
        this.setEntityFlag(Flags.Entity.L_DESTROYED);
        if (this._costMap) {
            GWU.grid.free(this._costMap);
            this._costMap = null;
        }
        if (this._goalMap) {
            GWU.grid.free(this._goalMap);
            this._goalMap = null;
        }
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
    setActorFlag(flag: number) {
        this.flags.actor |= flag;
    }
    clearActorFlag(flag: number) {
        this.flags.actor &= ~flag;
    }

    isPlayer() {
        return this.hasActorFlag(Flags.Actor.IS_PLAYER);
    }

    isDead() {
        return this.hasEntityFlag(Flags.Entity.L_DESTROYED);
    }

    getAction(name: string): ActorActionResult {
        const action = this.kind.actions[name];
        if (action === undefined || action === true) {
            const main = getAction(name); // default is to do any action
            return main || false;
        } else if (action === false) {
            return false;
        }

        return action;
    }

    getBumpActions(): (ActorActionFn | string)[] {
        return this.kind.bump;
    }

    /////////////// VISIBILITY

    canSee(x: number, y: number): boolean;
    canSee(entity: Entity.Entity): boolean;
    canSee(x: number | Entity.Entity, y?: number): boolean {
        if (x instanceof Entity.Entity) {
            if (x instanceof Actor) {
                if (x.fov) return x.fov.isDirectlyVisible(this.x, this.y);
            }
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

    ////////////////// ACTOR

    async act(game: Game): Promise<number> {
        if (this.ai && this.ai.fn) {
            const r = await this.ai.fn(game, this);
            if (r) return r;
        }

        if (this.kind.ai) {
            const r = await this.kind.ai.fn(game, this);
            if (r) return r;
        }

        // idle - always
        return this.moveSpeed();
    }

    moveSpeed(): number {
        return this.kind.moveSpeed;
    }

    startTurn() {}

    endTurn(pct = 100): number {
        return Math.floor((pct * this.moveSpeed()) / 100);
    }

    ///////

    willAttack(_other: Actor): boolean {
        return true;
    }

    canPass(_other: Actor): boolean {
        return false;
    }

    ////////////////// INVENTORY

    avoidsItem(_item: Item): boolean {
        return false;
    }

    canAddItem(_item: Item): boolean {
        return false;
    }

    addItem(_item: Item): void {}

    pickupItem(item: Item, opts?: Partial<PickupOptions>): boolean {
        return this.kind.pickupItem(this, item, opts);
    }

    dropItem(item: Item, opts?: Partial<DropOptions>): boolean {
        return this.kind.dropItem(this, item, opts);
    }

    // PATHFINDING

    addToMap(map: MapType, x: number, y: number): boolean {
        const mapChanged = super.addToMap(map, x, y);
        if (mapChanged) {
            this.clearActorFlag(Flags.Actor.STABLE_COST_MAP);
        }
        return mapChanged;
    }

    removeFromMap() {
        super.removeFromMap();
        if (this._costMap) {
            GWU.grid.free(this._costMap);
            this._costMap = null;
        }
        if (this._goalMap) {
            GWU.grid.free(this._goalMap);
            this._goalMap = null;
        }
    }

    /*
    Calculates and returns the actor's move cost map.
    Used in pathfinding.
    */
    costMap(): GWU.grid.NumGrid {
        if (!this.map) {
            throw new Error('Actor must have map to calculate costMap.');
        }

        const staleMap = !this.hasActorFlag(Flags.Actor.STABLE_COST_MAP);
        if (staleMap && this._costMap) {
            GWU.grid.free(this._costMap);
            this._costMap = null;
        }
        if (!this._costMap) {
            this._costMap = GWU.grid.alloc(this.map.width, this.map.height);
        } else if (!staleMap) {
            return this._costMap;
        }

        const kind = this.kind;
        const map = this.map;
        this._costMap.update((_v, x, y) => {
            const cell = map.cell(x, y);
            if (kind.forbidsCell(cell, this)) {
                return cell.hasEntityFlag(Flags.Entity.L_BLOCKS_DIAGONAL)
                    ? GWU.path.OBSTRUCTION
                    : GWU.path.FORBIDDEN;
            } else if (kind.avoidsCell(cell, this)) {
                return GWU.path.AVOIDED;
            }
            return GWU.path.OK;
        });

        this.setActorFlag(Flags.Actor.STABLE_COST_MAP);

        /*

			if (cellHasTerrainFlag(i, j, T_OBSTRUCTS_PASSABILITY)
            && (!cellHasTMFlag(i, j, TM_IS_SECRET) || (discoveredTerrainFlagsAtLoc(i, j) & T_OBSTRUCTS_PASSABILITY)))
			{
				playerCostMap[i][j] = monsterCostMap[i][j] = cellHasTerrainFlag(i, j, T_OBSTRUCTS_DIAGONAL_MOVEMENT) ? PDS_OBSTRUCTION : PDS_FORBIDDEN;
			} else if (cellHasTerrainFlag(i, j, T_SACRED)) {
					playerCostMap[i][j] = 1;
					monsterCostMap[i][j] = PDS_FORBIDDEN;
			} else if (cellHasTerrainFlag(i, j, T_LAVA_INSTA_DEATH)) {
        monsterCostMap[i][j] = PDS_FORBIDDEN;
        if (player.status[STATUS_LEVITATING] || !player.status[STATUS_IMMUNE_TO_FIRE]) {
            playerCostMap[i][j] = 1;
        } else {
            playerCostMap[i][j] = PDS_FORBIDDEN;
        }
			} else {
				if (pmap[i][j].flags & HAS_MONSTER) {
					monst = monsterAtLoc(i, j);
					if ((monst.creatureState == MONSTER_SLEEPING
						 || monst.turnsSpentStationary > 2
             || (monst.info.flags & MONST_GETS_TURN_ON_ACTIVATION)
						 || monst.creatureState == MONSTER_ALLY)
						&& monst.creatureState != MONSTER_FLEEING)
					{
						playerCostMap[i][j] = 1;
						monsterCostMap[i][j] = PDS_FORBIDDEN;
						continue;
					}
				}

				if (cellHasTerrainFlag(i, j, (T_AUTO_DESCENT | T_IS_DF_TRAP))) {
					monsterCostMap[i][j] = PDS_FORBIDDEN;
          if (player.status[STATUS_LEVITATING]) {
              playerCostMap[i][j] = 1;
          } else {
              playerCostMap[i][j] = PDS_FORBIDDEN;
          }
				} else if (cellHasTerrainFlag(i, j, T_IS_FIRE)) {
					monsterCostMap[i][j] = PDS_FORBIDDEN;
          if (player.status[STATUS_IMMUNE_TO_FIRE]) {
              playerCostMap[i][j] = 1;
          } else {
              playerCostMap[i][j] = PDS_FORBIDDEN;
          }
				} else if (cellHasTerrainFlag(i, j, (T_IS_DEEP_WATER | T_SPONTANEOUSLY_IGNITES))) {
          if (player.status[STATUS_LEVITATING]) {
              playerCostMap[i][j] = 1;
          } else {
              playerCostMap[i][j] = 5;
          }
					monsterCostMap[i][j] = 5;
        } else if (cellHasTerrainFlag(i, j, T_OBSTRUCTS_PASSABILITY)
                   && cellHasTMFlag(i, j, TM_IS_SECRET) && !(discoveredTerrainFlagsAtLoc(i, j) & T_OBSTRUCTS_PASSABILITY)
                   && !(pmap[i][j].flags & IN_FIELD_OF_VIEW))
			 {
            // Secret door that the player can't currently see
            playerCostMap[i][j] = 100;
            monsterCostMap[i][j] = 1;
				} else {
					playerCostMap[i][j] = monsterCostMap[i][j] = 1;
				}
			}
		}
	}
        */

        return this._costMap;
    }

    get goalMap(): GWU.grid.NumGrid | null {
        return this._goalMap;
    }

    setGoal(x: number, y: number): GWU.grid.NumGrid {
        const map = this._map;
        if (!map) throw new Error('No map to set goal with!');

        if (!this._goalMap) {
            this._goalMap = GWU.grid.alloc(map.width, map.height);
        }

        const goalMap = this._goalMap;
        GWU.path.calculateDistances(goalMap, x, y, this.costMap());
        return this._goalMap;
    }

    clearGoal() {
        if (this._goalMap) {
            GWU.grid.free(this._goalMap);
            this._goalMap = null;
        }
    }
}
