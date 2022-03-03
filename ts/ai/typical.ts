import * as GWU from 'gw-utils';
import * as ACTION from '../action';

import * as AI from './ai';
import { wander } from './wander';

/*
http://roguebasin.com/index.php/Roguelike_Intelligence_-_Stateless_AIs
-- Typical AI
*/
export function typical(action: ACTION.Action): void {
    // const map = action.map;
    const actor = action.actor;
    if (!actor) throw new Error('Actor required.');

    if (actor.isDead()) return action.didNothing();

    const target = action.game.player;
    const tryAttack = actor.canSee(target) && actor.willAttack(target);

    if (tryAttack) {
        const damagePct = 100 - actor.stats.getPct('health');
        const morale = actor.stats.get('morale');

        const chargeChance = 100;
        const retreatChance = 0;

        actor.ai!.lastSawPlayer = [target.x, target.y];
        actor.clearGoal();
        console.log('SAW YOU!', actor.id, target.x, target.y);

        if (damagePct > morale) {
            if (canRunAwayFrom(action)) {
                runAwayFrom(action);
            } else if (canAttack(action)) {
                attack(action);
            }
            return;
        }

        if (tooFarFrom(action) && canAttack(action) && canMoveToward(action)) {
            if (GWU.random.chance(chargeChance)) {
                moveToward(action);
            } else {
                attack(action);
            }
            return;
        }

        if (
            tooCloseTo(action) &&
            canAttack(action) &&
            canMoveAwayFrom(action)
        ) {
            if (GWU.random.chance(retreatChance)) {
                moveAwayFrom(action);
            } else {
                attack(action);
            }
            return;
        }

        if (canAttack(action)) {
            attack(action);
            return;
        }

        if (tooFarFrom(action) && canMoveToward(action)) {
            moveToward(action);
            return;
        }

        if (tooCloseTo(action) && canMoveAwayFrom(action)) {
            moveAwayFrom(action);
            return;
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

        moveTowardGoal(action);
        if (action.isSuccess()) {
            return;
        }
        actor.ai!.lastSawPlayer = null; // no longer
        actor.clearGoal();
    }

    // check if they noticed the player scent
    if (target.scent) {
        action.dir = target.scent.nextDir(actor.x, actor.y);
        if (action.dir) {
            console.log('tracking scent', actor.id, action.dir);
            ACTION.doAction('moveDir', action);
            if (action.isDone()) return;
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
            wander(action);
            if (action.isSuccess()) return;
        } else {
            ACTION.doAction('idle', action);
            if (action.isSuccess()) {
                return;
            }
        }
    }

    return ACTION.doAction('standStill', action);
}

AI.install('typical', typical);
AI.install('default', typical);

export function canMoveToward(action: ACTION.Action): boolean {
    // can move?

    const map = action.map;
    const actor = action.actor;
    if (!actor) throw new Error('Actor required.');

    const target = action.target;
    if (!target) throw new Error('No target.');

    let x = target.x;
    let y = target.y;

    const distanceMap = GWU.grid.alloc(map.width, map.height);
    const costMap = actor.costMap();
    GWU.path.calculateDistances(distanceMap, x, y, costMap);

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

    GWU.grid.free(distanceMap);
    return count > 0;
}

export function moveToward(action: ACTION.Action): void {
    // pathfinding?
    const map = action.map;
    const actor = action.actor;
    if (!actor) throw new Error('Actor required.');

    const target = action.target;
    if (!target) throw new Error('No target.');

    let x = target.x;
    let y = target.y;

    const distanceMap = GWU.grid.alloc(map.width, map.height);
    const costMap = actor.costMap();
    GWU.path.calculateDistances(distanceMap, x, y, costMap);

    const step = GWU.path.nextStep(distanceMap, actor.x, actor.y, (x, y) => {
        const cell = map.cell(x, y);
        if (!cell) return true;
        if (cell.hasActor() && cell.actor !== action.target) return true;
        if (cell.blocksMove()) return true;
        return false;
    });

    GWU.grid.free(distanceMap);

    if (!step || (step[0] == 0 && step[1] == 0)) {
        return ACTION.doAction('standStill', action);
    }

    action.dir = step;
    return ACTION.doAction('moveDir', action);
}

export function canMoveAwayFrom(_action: ACTION.Action): boolean {
    // can move?

    // const distanceMap = ctx.distanceMap;
    // const canMoveDiagonal = false;

    // // look for distance > current around me

    // let center = distanceMap[actor.x][actor.y];
    // let count = 0;
    // GWU.xy.eachNeighbor(
    //     actor.x,
    //     actor.y,
    //     (x, y) => {
    //         const d = distanceMap[x][y];
    //         if (d >= GWU.path.NO_PATH) return;
    //         if (distanceMap[x][y] > center) {
    //             ++count;
    //         }
    //     },
    //     canMoveDiagonal
    // );

    // return ctx.done(count > 0);
    return false;
}

export function moveAwayFrom(action: ACTION.Action): void {
    const actor = action.actor;
    if (!actor) throw new Error('Need actor.');
    // safety/strategy?

    // always move using safety map?

    actor.endTurn();
    return action.didSomething();
}

export function canRunAwayFrom(_action: ACTION.Action): boolean {
    // can move?
    return false;
}

export function runAwayFrom(action: ACTION.Action): void {
    // move toward loop if away from player
    if (!action.actor) throw new Error('Need actor.');

    action.actor.endTurn();
    return action.didSomething();
}

export function canAttack(action: ACTION.Action): boolean {
    // has attack?
    // attack affects player?
    // cooldown?
    const actor = action.actor;
    const target = action.target;
    if (!actor || !target) return false;
    return GWU.xy.distanceFromTo(actor, target) <= 1;
}

export function attack(action: ACTION.Action): void {
    const actor = action.actor;
    const target = action.target;
    if (!actor || !target)
        throw new Error('Actor and Target required to attack.');

    console.log('attack!', actor.id, target.id);

    return ACTION.doAction('attack', action);
}

export function tooFarFrom(action: ACTION.Action): boolean {
    // diagonal?
    const actor = action.actor;
    const target = action.target;
    if (!actor || !target) return true;

    return GWU.xy.distanceFromTo(actor, target) > 1;
}

export function tooCloseTo(action: ACTION.Action): boolean {
    const actor = action.actor;
    const target = action.target;
    if (!actor || !target) return true;

    return GWU.xy.distanceFromTo(actor, target) < 1;
}

// TODO - make an action
export function moveTowardGoal(action: ACTION.Action): void {
    const actor = action.actor;
    if (!actor) throw new Error('Need actor.');

    if (!actor.hasGoal()) return action.didNothing();

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
        return action.didNothing();
    }

    action.dir = nextStep;
    return ACTION.doAction('moveDir', action);
}
