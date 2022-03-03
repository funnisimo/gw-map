import * as GWU from 'gw-utils';

import * as ACTION from '../action';
import { moveDir } from './moveDir';

export function idle(action: ACTION.Action): void {
    const actor = action.actor;
    if (!actor) throw new Error('Action requires an actor.');

    if (GWU.random.chance(50)) {
        // stand still
        actor.endTurn();
        return action.didSomething();
    }

    // try to step in a random direction
    const dirIndex = GWU.random.number(4);
    action.dir = GWU.xy.DIRS[dirIndex];
    return moveDir(action);
}

ACTION.install('idle', idle);
