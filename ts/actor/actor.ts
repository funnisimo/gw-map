import * as GWU from 'gw-utils';
import * as Entity from '../entity/entity';
import { ActorFlags } from './types';
import * as Flags from '../flags';
import { ActorKind } from './kind';
import { ActorActionFn, getAction, ActorActionResult } from './action';
import { Item } from '../item/item';
import { Status } from './status';
import { Stats } from './stat';
import { Game } from '../game';
import { AIConfig } from '../ai/ai';
import { Map } from '../map/map';

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
    ai: AIConfig = {};

    leader: Actor | null = null;
    items: Item | null = null; // inventory

    visionDistance = 99;
    stats: Stats;
    status: Status;

    data: Record<string, number> = {};
    _costMap: GWU.grid.NumGrid | null = null;
    _goalMap: GWU.grid.NumGrid | null = null;
    _mapToMe: GWU.grid.NumGrid | null = null;

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
        if (this._mapToMe) {
            GWU.grid.free(this._mapToMe);
            this._mapToMe = null;
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

    becameVisible(): boolean {
        return (
            this.hasActorFlag(Flags.Actor.IS_VISIBLE) &&
            !this.hasActorFlag(Flags.Actor.WAS_VISIBLE)
        );
    }

    canSee(x: number, y: number): boolean;
    canSee(entity: Entity.Entity): boolean;
    canSee(x: number | Entity.Entity, y?: number): boolean {
        if (x instanceof Entity.Entity) {
            return this.canSee(x.x, x.y) && this.kind.isAbleToSee(this, x);
        } else if (this.map) {
            if (this.isPlayer()) {
                return this.map!.fov.isDirectlyVisible(x, y!);
            }

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
        if (this.map && this.isPlayer()) {
            return this.map.fov.isAnyKindOfVisible(x, y!);
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
        let startedVisible = false;
        if (game.player.canSee(this)) {
            this.setActorFlag(Flags.Actor.IS_VISIBLE);
            startedVisible = true;
        } else {
            if (this.hasActorFlag(Flags.Actor.IS_VISIBLE)) {
                console.log('not visible');
            }
            this.clearActorFlag(Flags.Actor.IS_VISIBLE);
        }

        if (this.becameVisible()) {
            console.log('became visible');
            game.player.interrupt(this);
        }

        let r = 0;
        if (this.ai && this.ai.fn) {
            r = await this.ai.fn(game, this);
        }

        if (r == 0 && this.kind.ai.fn) {
            r = await this.kind.ai.fn(game, this);
        }

        if (r) {
            // did something
            if (startedVisible || game.player.canSee(this)) {
            }
            return r;
        }

        // idle - always
        return this.endTurn();
    }

    moveSpeed(): number {
        return this.kind.moveSpeed;
    }

    startTurn() {}

    endTurn(pct = 100): number {
        if (this.hasActorFlag(Flags.Actor.IS_VISIBLE)) {
            this.setActorFlag(Flags.Actor.WAS_VISIBLE);
        } else {
            this.clearActorFlag(Flags.Actor.WAS_VISIBLE);
        }
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

    addToMap(map: Map, x: number, y: number): boolean {
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
        if (this._mapToMe) {
            GWU.grid.free(this._mapToMe);
            this._mapToMe = null;
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
            return kind.cellCost(cell, this);
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

    hasGoal(): boolean {
        return !!this._goalMap;
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

    mapToMe(): GWU.grid.NumGrid {
        if (!this.map) throw new Error('No map!');
        if (!this._mapToMe) {
            this._mapToMe = GWU.grid.alloc(this.map.width, this.map.height);
        }

        if (this._mapToMe.x !== this.x || this._mapToMe.y !== this.y) {
            GWU.path.calculateDistances(
                this._mapToMe,
                this.x,
                this.y,
                this.costMap()
            );
        }

        return this._mapToMe;
    }
}
