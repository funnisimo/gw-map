import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { Game } from '../game';
import * as Flags from '../flags';

import { getAction } from '../actor/action';

export async function wander(game: Game, actor: Actor): Promise<number> {
    // Do we have a wander target?
    let goalMap = actor.goalMap;
    if (!goalMap) {
        //      pick new wander target
        const costMap = actor.costMap();

        const loc = GWU.random.matchingLoc(
            costMap.width,
            costMap.height,
            (x, y) => {
                return costMap[x][y] > 0 && costMap[x][y] !== GWU.path.NO_PATH;
            }
        );

        if (!loc || loc[0] < 0 || loc[1] < 0) {
            console.log('No wander location found!');
            return 0;
        }

        //      build distance map to target
        goalMap = actor.setGoal(loc[0], loc[1]);
    }

    // take the next step to the target
    const step = GWU.path.nextStep(goalMap, actor.x, actor.y, (x, y) => {
        if (!game.map.hasActor(x, y)) return false;
        const other = game.map.actorAt(x, y);
        if (!other) {
            console.log(`Cell @ ${x},${y} has actor flag, but no actor.`);
            game.map.cell(x, y).clearCellFlag(Flags.Cell.HAS_ACTOR);
            return false;
        }
        return !actor.canPass(other);
    });

    if (!step) {
        actor.clearGoal();
        return 0;
    }

    let result = 0;
    if (!step || (step[0] == 0 && step[1] == 0)) {
        return 0; // did nothing
    }

    const moveDir = getAction('moveDir');
    if (!moveDir) throw new Error('No moveDir action found for Actors!');

    result = await moveDir(game, actor, { dir: step });
    return result;
}
