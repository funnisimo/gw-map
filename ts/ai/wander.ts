import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import * as ACTION from '../action';

export function wander(action: ACTION.Action): void {
    const map = action.map;
    const actor = action.actor;
    if (!actor) throw new Error('Actor required.');

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
            return action.didNothing();
        }

        //      build distance map to target
        goalMap = actor.setGoal(loc[0], loc[1]);
    }

    // take the next step to the target
    const step = GWU.path.nextStep(goalMap, actor.x, actor.y, (x, y) => {
        if (!map.hasActor(x, y)) return false;
        const other = map.actorAt(x, y);
        if (!other) {
            console.log(`Cell @ ${x},${y} has actor flag, but no actor.`);
            map.cell(x, y).clearCellFlag(Flags.Cell.HAS_ACTOR);
            return false;
        }
        return !actor.canPass(other);
    });

    if (!step) {
        actor.clearGoal();
        return action.didNothing();
    }

    if (!step || (step[0] == 0 && step[1] == 0)) {
        return action.didNothing();
    }

    action.dir = step;
    return ACTION.doAction('moveDir', action);
}
