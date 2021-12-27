import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { ActorActionCtx, installAction } from '../action';
import { Game } from '../../game';
import { Item } from '../../item';

export async function pickup(
    game: Game,
    actor: Actor,
    ctx: ActorActionCtx = {}
): Promise<number> {
    const map = actor.map;
    if (!map) throw new Error('Actor not on map!');

    const item = actor.map.itemAt(actor.x, actor.y) as Item;
    if (!item) {
        if (!ctx.quiet) {
            GWU.message.addAt(actor.x, actor.y, 'Nothing to pickup.');
        }
        return 0;
    }

    if (actor.avoidsItem(item)) return 0;

    const itemAction = item.getAction('pickup');
    if (itemAction === false) {
        if (!ctx.quiet) {
            GWU.message.addAt(
                actor.x,
                actor.y,
                'You cannot pickup %{the.item}.',
                {
                    item,
                }
            );
        }
        return 0;
    } else if (typeof itemAction === 'function') {
        // You have to do everything
        const result = await itemAction(game, actor, item);
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
    if (!ctx.quiet) {
        GWU.message.addAt(actor.x, actor.y, 'You pickup %{the:item}.', {
            item,
        });
    }
    return actor.endTurn();
}

installAction('pickup', pickup);
