import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { ActorActionCtx, installAction } from '../action';
import { Game } from '../../game';
import * as Flags from '../../flags';

export async function climb(
    game: Game,
    actor: Actor,
    _ctx?: ActorActionCtx
): Promise<number> {
    const map = game.map;
    const x = actor.x;
    const y = actor.y;

    if (map.hasTileFlag(x, y, Flags.Tile.T_UP_STAIRS)) {
        GWU.message.addAt(x, y, '{{you}} {{verb climb[s]}}.', { actor });
        game.startNewMap(map.id + 1);
        return actor.endTurn();
    }

    GWU.message.addAt(x, y, 'Nothing to climb.');
    return actor.endTurn(50); // half turn
}

installAction('climb', climb);
