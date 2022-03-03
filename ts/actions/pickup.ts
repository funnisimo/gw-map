import * as GWU from 'gw-utils';

import * as ACTION from '../action';
import { Item } from '../item';

export function pickup(action: ACTION.Action): void {
    const map = action.map;
    if (!map) throw new Error('Map is required!');

    const actor = action.actor;
    if (!actor) throw new Error('Actor is required.');

    const item = map.itemAt(action.x, action.y) as Item;
    if (!item) {
        if (!action.quiet) {
            GWU.message.addAt(action.x, action.y, 'Nothing to pickup.');
        }
        return action.didNothing();
    }

    if (actor.avoidsItem(item)) return action.didNothing();

    if (item.canDoAction('pickup') === false) {
        if (!action.quiet) {
            GWU.message.addAt(
                actor.x,
                actor.y,
                '{{you}} cannot pickup {{the item}}.',
                {
                    actor,
                    item,
                }
            );
        }
        return action.didNothing();
    }

    // logs error messages
    if (!actor.canAddItem(item)) {
        return action.didNothing();
    }

    if (!map.removeItem(item)) {
        return action.didNothing();
    }

    actor.addItem(item);
    if (!action.quiet) {
        GWU.message.addAt(
            actor.x,
            actor.y,
            '{{you}} {{verb pick[s]}} up {{an item}}.',
            {
                actor,
                item,
            }
        );
    }
    actor.endTurn();
    action.didSomething();
}

ACTION.install('pickup', pickup);
