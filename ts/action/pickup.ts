import * as GWU from 'gw-utils';

import { install } from './action';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';
import { Item } from '../item';

export async function pickup(this: Game, actor: Actor, _ev: GWU.io.Event) {
    if (!actor.map) return false;

    const item = actor.map.itemAt(actor.x, actor.y);
    if (!item) {
        GWU.message.addAt(actor.x, actor.y, 'Nothing to pickup.');
        return false;
    }

    const myItem = item as Item;

    if (actor.avoidsItem(myItem)) return false;

    let action = myItem.getAction('pickup');
    if (action === false) {
        GWU.message.addAt(actor.x, actor.y, 'You cannot pickup %{the.item}.', {
            item,
        });
        return false;
    } else if (typeof action === 'function') {
        // You have to do everything
        return action.call(this, actor, { item: myItem });
    }

    // logs error messages
    if (!actor.canAddItem(myItem)) {
        return false;
    }

    if (!actor.map.removeItem(myItem)) {
        return false;
    }

    actor.addItem(myItem);

    return true;
}

install('pickup', pickup);
