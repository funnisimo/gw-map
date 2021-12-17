import { Actor } from '../actor';
import { ActorActionCtx, installAction } from '../action';
import { Game } from '../../game';

export async function standStill(
    _game: Game,
    actor: Actor,
    _ctx?: ActorActionCtx
): Promise<number> {
    return actor.moveSpeed();
}

installAction('standStill', standStill);
installAction('idle', standStill);