import * as GWU from 'gw-utils';
import { Horde as Flags } from '../flags/horde';
import * as Map from '../map';
import * as Actor from '../actor';

export interface HordeConfig {
    leader: string;
    members?: Record<string, GWU.range.RangeBase>;
    tags?: string | string[];
    frequency?: GWU.frequency.FrequencyConfig;
    // blueprintId?: string;
    flags?: GWU.flag.FlagBase;
    requiredTile?: string;
}

export interface HordeFlagsType {
    horde: number;
}

export interface SpawnOptions {
    canSpawn: GWU.xy.XYMatchFunc;
    rng: GWU.rng.Random;
    machine: number;
}

export class Horde {
    tags: string[] = [];
    leader: string;
    members: Record<string, GWU.range.Range> = {};
    frequency: GWU.frequency.FrequencyFn;
    // blueprintId: string | null = null;
    flags: HordeFlagsType = { horde: 0 };
    // requiredTile: string | null = null;

    constructor(config: HordeConfig) {
        if (config.tags) {
            if (typeof config.tags === 'string') {
                this.tags = config.tags.split(/[,|]/).map((t) => t.trim());
            } else {
                this.tags = config.tags.slice();
            }
        }
        this.leader = config.leader;
        if (config.members) {
            Object.entries(config.members).forEach(([id, range]) => {
                this.members[id] = GWU.range.make(range);
            });
        }
        this.frequency = GWU.frequency.make(config.frequency || 100);
        // this.blueprintId = config.blueprintId || null;
        this.flags.horde = GWU.flag.from(Flags, config.flags);
        // if (config.requiredTile) this.requiredTile = config.requiredTile;
    }

    spawn(
        map: Map.Map,
        x = -1,
        y = -1,
        opts: Partial<SpawnOptions> = {}
    ): Actor.Actor | null {
        opts.canSpawn = opts.canSpawn || GWU.TRUE;
        opts.rng = opts.rng || map.rng;
        opts.machine = opts.machine ?? 0;

        const leader = this._spawnLeader(map, x, y, opts as SpawnOptions);
        if (!leader) return null;

        this._spawnMembers(leader, map, opts as SpawnOptions);

        return leader;
    }

    _spawnLeader(
        map: Map.Map,
        x: number,
        y: number,
        opts: SpawnOptions
    ): Actor.Actor | null {
        const leaderKind = Actor.get(this.leader);
        if (!leaderKind) {
            throw new Error('Failed to find leader kind = ' + this.leader);
        }

        if (x >= 0 && y >= 0) {
            if (leaderKind.avoidsCell(map.cell(x, y))) return null;
        }

        const leader = Actor.make(leaderKind, { machineHome: opts.machine });
        if (!leader)
            throw new Error('Failed to make horde leader - ' + this.leader);

        if (x < 0 || y < 0) {
            [x, y] = this._pickLeaderLoc(leader, map, opts) || [-1, -1];
            if (x < 0 || y < 0) {
                return null;
            }
        }

        // pre-placement stuff?  machine? effect?

        if (!this._addLeader(leader, map, x, y, opts)) {
            return null;
        }

        return leader;
    }

    _addLeader(
        leader: Actor.Actor,
        map: Map.Map,
        x: number,
        y: number,
        _opts: SpawnOptions
    ): boolean {
        return map.addActor(x, y, leader);
    }

    _addMember(
        member: Actor.Actor,
        map: Map.Map,
        x: number,
        y: number,
        leader: Actor.Actor,
        _opts: SpawnOptions
    ): boolean {
        member.leader = leader;
        return map.addActor(x, y, member);
    }

    _spawnMembers(
        leader: Actor.Actor,
        map: Map.Map,
        opts: SpawnOptions
    ): number {
        const entries = Object.entries(this.members);

        if (entries.length == 0) return 0;

        let count = 0;
        entries.forEach(([kindId, countRange]) => {
            const count = countRange.value(opts.rng);
            for (let i = 0; i < count; ++i) {
                this._spawnMember(kindId, map, leader, opts);
            }
        });

        return count;
    }

    _spawnMember(
        kindId: string,
        map: Map.Map,
        leader: Actor.Actor,
        opts: SpawnOptions
    ): Actor.Actor | null {
        const kind = Actor.get(kindId);
        if (!kind) {
            throw new Error('Failed to find member kind = ' + kindId);
        }

        const member = Actor.make(kind, { machineHome: opts.machine });
        if (!member) throw new Error('Failed to make horde member - ' + kindId);

        const [x, y] = this._pickMemberLoc(member, map, leader, opts) || [
            -1, -1,
        ];
        if (x < 0 || y < 0) {
            return null;
        }

        // pre-placement stuff?  machine? effect?

        if (!this._addMember(member, map, x, y, leader, opts)) {
            return null;
        }

        return member;
    }

    _pickLeaderLoc(
        leader: Actor.Actor,
        map: Map.Map,
        opts: SpawnOptions
    ): GWU.xy.Loc | null {
        let loc = opts.rng.matchingLoc(map.width, map.height, (x, y) => {
            const cell = map.cell(x, y);
            if (cell.hasActor()) return false; // Brogue kills existing actors, but lets do this instead
            if (!opts.canSpawn(x, y)) return false;

            if (leader.avoidsCell(cell)) return false;

            if (Map.isHallway(map, x, y)) {
                return false;
            }
            return true;
        });
        return loc;
    }

    _pickMemberLoc(
        actor: Actor.Actor,
        map: Map.Map,
        leader: Actor.Actor,
        opts: SpawnOptions
    ): GWU.xy.Loc | null {
        let loc = opts.rng.matchingLocNear(leader.x, leader.y, (x, y) => {
            if (!map.hasXY(x, y)) return false;

            const cell = map.cell(x, y);
            if (cell.hasActor()) return false; // Brogue kills existing actors, but lets do this instead
            // if (map.fov.isAnyKindOfVisible(x, y)) return false;

            if (actor.avoidsCell(cell)) return false;

            if (Map.isHallway(map, x, y)) {
                return false;
            }
            return true;
        });
        return loc;
    }
}
