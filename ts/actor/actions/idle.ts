import * as GWU from 'gw-utils';

import { Actor } from '../actor';
import { ActorActionCtx, installAction } from '../action';
import { Game } from '../../game';

import { moveDir } from './moveDir';

export async function idle(
    game: Game,
    actor: Actor,
    _ctx?: ActorActionCtx
): Promise<number> {
    if (GWU.random.chance(50)) {
        // do nothing
        return actor.endTurn();
    }

    // try to step in a random direction
    const dirIndex = GWU.random.number(4);

    const dir = GWU.xy.DIRS[dirIndex];

    const result = await moveDir(game, actor, { dir, try: true });
    if (result) return result;

    // stand still
    return actor.endTurn();
}

installAction('idle', idle);
