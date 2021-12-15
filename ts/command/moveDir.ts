import * as GWU from 'gw-utils';

import { install } from './command';
import * as Actor from '../actor';
import { Game } from '../game/game';

// COMMANDS
// this === GAME
export async function moveDir(this: Game, actor: Actor.Actor, e: GWU.io.Event) {
    const dir = e.dir;
    if (!actor.map || !dir) return -1;

    return Actor.actions.moveDir(this, actor, e);
}

install('moveDir', moveDir);
