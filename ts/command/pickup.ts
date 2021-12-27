import * as GWU from 'gw-utils';

import { installCommand } from './command';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';

export async function pickup(
    this: Game,
    actor: Actor,
    _ev: GWU.io.Event
): Promise<number> {
    if (!actor.map) return -1;

    const playerAction = actor.getAction('pickup');
    if (!playerAction) {
        GWU.message.addAt(actor.x, actor.y, 'You cannot pickup items.');
        return actor.endTurn();
    } else {
        // You have to do everything
        const result = await playerAction(this, actor);
        if (result) return result; // handled
    }

    // Should never get here, but...
    const standStill = actor.getAction('standStill');
    if (!standStill) throw new Error('Actor cannot stand still.');
    return standStill(this, actor);
}

installCommand('pickup', pickup);
