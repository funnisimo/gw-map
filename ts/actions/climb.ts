import * as GWU from 'gw-utils';

import * as ACTION from '../action';
import * as Flags from '../flags';

export function climb(action: ACTION.Action): void {
    const map = action.map;
    const actor = action.actor;
    if (!actor) throw new Error('Actor is required.');
    const x = action.x;
    const y = action.y;

    if (map.hasTileFlag(x, y, Flags.Tile.T_UP_STAIRS)) {
        GWU.message.addAt(x, y, '{{you}} {{verb climb[s]}}.', { actor });
        action.game.startNewMap({ up: true });
        actor.endTurn();
        return action.didSomething();
    }

    GWU.message.addAt(x, y, 'Nothing to climb.');
    actor.endTurn(50); // half turn??
    return action.didSomething();
}

ACTION.install('climb', climb);
