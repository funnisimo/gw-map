import * as GWU from 'gw-utils';

import { install } from './command';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';
import { Item } from '../item';

export async function pickup(
    this: Game,
    actor: Actor,
    _ev: GWU.io.Event
): Promise<number> {
    if (!actor.map) return -1;

    const playerAction = actor.getAction('pickup');
    if (playerAction === false) {
        GWU.message.addAt(actor.x, actor.y, 'You cannot pickup items.');
        return actor.endTurn();
    } else if (typeof playerAction === 'function') {
        // You have to do everything
        const result = await playerAction(this, actor);
        if (result) return result; // handled
    }

    const item = actor.map.itemAt(actor.x, actor.y) as Item;
    if (!item) {
        GWU.message.addAt(actor.x, actor.y, 'Nothing to pickup.');
        return 0;
    }

    if (actor.avoidsItem(item)) return 0;

    const itemAction = item.getAction('pickup');
    if (itemAction === false) {
        GWU.message.addAt(actor.x, actor.y, 'You cannot pickup %{the.item}.', {
            item,
        });
        return 0;
    } else if (typeof itemAction === 'function') {
        // You have to do everything
        const result = await itemAction(this, actor, item);
        if (result) return result; // handled
    }

    // logs error messages
    if (!actor.canAddItem(item)) {
        return 0;
    }

    if (!actor.map.removeItem(item)) {
        return 0;
    }

    actor.addItem(item);
    return actor.endTurn();
}

install('pickup', pickup);
