import * as GWU from 'gw-utils';

import { install } from './action';
import { Actor } from '../actor/actor';
import { Game } from '../game/game';
import * as FX from '../fx';

// COMMANDS
// this === GAME
export async function moveDir(this: Game, actor: Actor, e: GWU.io.Event) {
    const dir = e.dir;
    if (!actor.map || !dir) return false;

    const newPos = GWU.xy.add(actor, dir);
    const cell = actor.map.cell(newPos.x, newPos.y);
    if (!cell) return false;

    if (actor.avoidsCell(cell)) {
        FX.hit(actor.map, newPos, 'hit', 100, this.layer);
        // todo - should this cost a turn?  Or part of one?
        return false;
    }
    actor.map.removeActor(actor);
    actor.map.addActor(newPos.x, newPos.y, actor);
    return true;
}

install('moveDir', moveDir);
