import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { getAction } from '../actor/action';
import { Game } from '../game';
import { Item } from '../item';
import * as AI from './ai';
import { wander } from './wander';

export class AICtx {
    game: Game;
    actor: Actor;
    target: Actor | null;
    item: Item | null = null;
    distanceMap: GWU.grid.NumGrid;
    count = 0;

    constructor(game: Game, actor: Actor, target?: Actor) {
        this.game = game;
        this.actor = actor;
        this.target = target || null;
        this.distanceMap = GWU.grid.alloc(game.map.width, game.map.height);

        if (target) {
            const costMap = actor.costMap();
            GWU.path.calculateDistances(
                this.distanceMap,
                target.x,
                target.y,
                costMap
            );
        }
    }

    start(): this {
        ++this.count;
        return this;
    }

    done<T>(result: T): T {
        --this.count;
        if (this.count == 0) {
            GWU.grid.free(this.distanceMap);
        }
        return result;
    }
}

/*
http://roguebasin.com/index.php/Roguelike_Intelligence_-_Stateless_AIs
-- Typical AI
*/
export async function typical(game: Game, actor: Actor): Promise<number> {
    if (actor.isDead()) return -1;

    const map = actor.map;
    if (!map) return -1; // actor not on map ?!?!

    const target = game.player;
    const tryAttack = actor.canSee(target) && actor.willAttack(target);

    if (tryAttack) {
        const damagePct = 100 - actor.stats.getPct('health');
        const morale = actor.stats.get('morale');

        const chargeChance = 100;
        const retreatChance = 0;

        actor.ai!.lastSawPlayer = [target.x, target.y];
        actor.clearGoal();
        console.log('SAW YOU!', actor.id, target.x, target.y);

        const ctx = new AICtx(game, actor, target).start();
        let result = 0;

        if (damagePct > morale) {
            if (canRunAwayFrom(game, actor, target, ctx)) {
                result = await runAwayFrom(game, actor, target, ctx);
            } else if (canAttack(game, actor, target, ctx)) {
                result = await attack(game, actor, target, ctx);
            }
            return ctx.done(result);
        }

        if (
            tooFarFrom(game, actor, target, ctx) &&
            canAttack(game, actor, target, ctx) &&
            canMoveToward(game, actor, target, ctx)
        ) {
            if (GWU.random.chance(chargeChance)) {
                result = await moveToward(game, actor, target, ctx);
            } else {
                result = await attack(game, actor, target, ctx);
            }
            return ctx.done(result);
        }

        if (
            tooCloseTo(game, actor, target, ctx) &&
            canAttack(game, actor, target, ctx) &&
            canMoveAwayFrom(game, actor, target, ctx)
        ) {
            if (GWU.random.chance(retreatChance)) {
                result = await moveAwayFrom(game, actor, target, ctx);
            } else {
                result = await attack(game, actor, target, ctx);
            }
            return ctx.done(result);
        }

        if (canAttack(game, actor, target, ctx)) {
            result = await attack(game, actor, target, ctx);
            return ctx.done(result);
        }

        if (
            tooFarFrom(game, actor, target, ctx) &&
            canMoveToward(game, actor, target, ctx)
        ) {
            result = await moveToward(game, actor, target, ctx);
            return ctx.done(result);
        }

        if (
            tooCloseTo(game, actor, target, ctx) &&
            canMoveAwayFrom(game, actor, target, ctx)
        ) {
            result = await moveAwayFrom(game, actor, target, ctx);
            return ctx.done(result);
        }
    }

    // TODO - Use scent, menory, other teammates info, ...
    else if (actor.ai!.lastSawPlayer) {
        if (!actor.hasGoal()) {
            const loc = actor.ai!.lastSawPlayer;
            actor.setGoal(loc[0], loc[1]);
        }
        console.log(
            'CHASING YOU!',
            actor.id,
            actor.goalMap!.x,
            actor.goalMap!.y
        );

        const result = await moveTowardGoal(game, actor);
        if (result) {
            return result;
        }
        actor.ai!.lastSawPlayer = null; // no longer
        actor.clearGoal();
    }

    // check if they noticed the player scent
    if (target.scent) {
        const dir = target.scent.nextDir(actor.x, actor.y);
        if (dir) {
            console.log('tracking scent', actor.id, dir);
            const moveDir = getAction('moveDir');
            if (!moveDir)
                throw new Error('No moveDir action found for Actors!');

            const result = await moveDir(game, actor, { dir });
            if (result) return result;
        }
    }

    const wanderOpt = GWU.object.firstOpt(
        'wander',
        actor.ai,
        actor.kind.ai,
        false
    );

    if (wanderOpt) {
        if (
            actor.goalMap || // we have a current goal
            typeof wanderOpt !== 'number' || // wander: true
            GWU.random.chance(wanderOpt) // chance
        ) {
            const result = wander(game, actor);
            if (result) return result;
        } else {
            const idle = getAction('idle');
            if (idle) {
                return idle(game, actor);
            }
        }
    }

    const standStill = getAction('standStill');
    if (!standStill) throw new Error('No standStill action found for actors!');
    return standStill(game, actor);
}

AI.install('typical', typical);
AI.install('default', typical);

export function canMoveToward(
    game: Game,
    actor: Actor,
    target: Actor,
    ctx?: AICtx
): boolean {
    // can move?

    ctx = (ctx || new AICtx(game, actor, target)).start();
    const distanceMap = ctx.distanceMap;
    const canMoveDiagonal = false;

    // look for distance > current around me

    let center = distanceMap[actor.x][actor.y];
    let count = 0;
    GWU.xy.eachNeighbor(
        actor.x,
        actor.y,
        (x, y) => {
            if (distanceMap[x][y] < center) {
                ++count;
            }
        },
        canMoveDiagonal
    );

    return ctx.done(count > 0);
}

export async function moveToward(
    game: Game,
    actor: Actor,
    target: Actor,
    ctx?: AICtx
): Promise<number> {
    // pathfinding?

    ctx = (ctx || new AICtx(game, actor, target)).start();

    // distanceMap.dump();
    const map = game.map;

    const step = GWU.path.nextStep(
        ctx.distanceMap,
        actor.x,
        actor.y,
        (x, y) => {
            const cell = map.cell(x, y);
            if (!cell) return true;
            if (cell.hasActor() && cell.actor !== target) return true;
            if (cell.blocksMove()) return true;
            return false;
        }
    );

    let result = 0;
    if (!step || (step[0] == 0 && step[1] == 0)) {
        const standStill = getAction('standStill');
        if (!standStill)
            throw new Error('No standStill action found for actors!');
        result = await standStill(game, actor);
        return ctx.done(result);
    }

    const moveDir = getAction('moveDir');
    if (!moveDir) throw new Error('No moveDir action found for Actors!');

    result = await moveDir(game, actor, { dir: step });
    return ctx.done(result);
}

export function canMoveAwayFrom(
    game: Game,
    actor: Actor,
    target: Actor,
    ctx?: AICtx
): boolean {
    // can move?

    ctx = (ctx || new AICtx(game, actor, target)).start();
    const distanceMap = ctx.distanceMap;
    const canMoveDiagonal = false;

    // look for distance > current around me

    let center = distanceMap[actor.x][actor.y];
    let count = 0;
    GWU.xy.eachNeighbor(
        actor.x,
        actor.y,
        (x, y) => {
            const d = distanceMap[x][y];
            if (d >= GWU.path.NO_PATH) return;
            if (distanceMap[x][y] > center) {
                ++count;
            }
        },
        canMoveDiagonal
    );

    return ctx.done(count > 0);
}

export async function moveAwayFrom(
    _game: Game,
    actor: Actor,
    _target: Actor,
    _ctx?: AICtx
): Promise<number> {
    // safety/strategy?

    // always move using safety map?

    return actor.endTurn();
}

export function canRunAwayFrom(
    _game: Game,
    _actor: Actor,
    _target: Actor,
    _ctx?: AICtx
): boolean {
    // can move?
    return false;
}

export async function runAwayFrom(
    _game: Game,
    actor: Actor,
    _target: Actor,
    _ctx?: AICtx
): Promise<number> {
    // move toward loop if away from player

    return actor.endTurn();
}

export function canAttack(
    _game: Game,
    actor: Actor,
    target: Actor,
    _ctx?: AICtx
): boolean {
    // has attack?
    // attack affects player?
    // cooldown?
    return GWU.xy.distanceFromTo(actor, target) <= 1;
}

export async function attack(
    game: Game,
    actor: Actor,
    target: Actor,
    _ctx?: AICtx
): Promise<number> {
    console.log('attack!', actor.id, target.id);

    let attack = actor.getAction('attack');
    if (!attack) return 0;

    return attack(game, actor, { actor: target });
}

export function tooFarFrom(
    _game: Game,
    actor: Actor,
    target: Actor,
    _ctx?: AICtx
): boolean {
    // diagonal?
    return GWU.xy.distanceFromTo(actor, target) > 1;
}

export function tooCloseTo(
    _game: Game,
    actor: Actor,
    target: Actor,
    _ctx?: AICtx
): boolean {
    return GWU.xy.distanceFromTo(actor, target) < 1;
}

// TODO - make an action
export async function moveTowardGoal(
    game: Game,
    actor: Actor
): Promise<number> {
    if (!actor.hasGoal()) return 0;

    const nextStep = GWU.path.nextStep(
        actor.goalMap!,
        actor.x,
        actor.y,
        (x, y) => {
            return actor.map!.hasActor(x, y);
        }
    );

    if (!nextStep) {
        actor.clearGoal();
        return 0;
    }

    const moveDir = actor.getAction('moveDir');
    if (!moveDir) throw new Error('No moveDir action for actor!');

    return await moveDir(game, actor, { dir: nextStep });
}
