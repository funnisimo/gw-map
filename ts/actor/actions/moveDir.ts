import { Actor } from '../actor';
import { ActorActionCtx, installAction } from '../action';
import { Game } from '../../game';
import { bump } from './bump';
import { standStill } from './standStill';
import * as FX from '../../fx';

export async function moveDir(
    game: Game,
    actor: Actor,
    ctx: ActorActionCtx = {}
): Promise<number> {
    //
    const step = ctx.dir;
    if (!step) throw new Error('moveDir called with no direction!');

    const newX = actor.x + step[0];
    const newY = actor.y + step[1];
    const map = game.map;

    const currentCell = map.cell(actor.x, actor.y);
    const newCell = map.cell(newX, newY);
    let result = 0;

    if (newCell.blocksMove()) {
        if (ctx.try) return 0;
        FX.hit(map, newCell, 'hit', 100);
        actor.clearGoal();
        return actor.endTurn();
    }

    // can we leave?
    if (!currentCell.canRemoveActor(actor)) {
        if (ctx.try) return 0;
        // canActorLeave must add appropriate message
        return actor.endTurn();
    }

    // is there an actor there?
    if (newCell.hasActor() || newCell.hasItem()) {
        if (ctx.try) return 0;
        const ctx2 = { actor: newCell.actor, item: newCell.item };
        result = await bump(game, actor, ctx2);
        if (result) return result;
    }

    // can we enter?
    if (!newCell.canAddActor(actor)) {
        if (ctx.try) return 0;
        return actor.endTurn();
    }

    if (!map.moveActor(actor, newX, newY)) {
        result = await standStill(game, actor, ctx);
        return result;
    }

    result = actor.endTurn();
    return result;
}

installAction('moveDir', moveDir);
