import * as GWU from 'gw-utils';
import * as ACTION from '../action';

import * as FX from '../fx';
import * as Flags from '../flags';

import { bump } from './bump';
import { standStill } from './standStill';

export function moveDir(action: ACTION.Action): void {
    //
    const step = action.dir;
    if (!step) throw new Error('moveDir called with no direction!');

    const actor = action.actor;
    const map = action.map;
    // const game = action.game;

    if (!actor) throw new Error('moveDir requires actor!');

    const newX = actor.x + step[0];
    const newY = actor.y + step[1];

    const currentCell = map.cell(actor.x, actor.y);
    const newCell = map.cell(newX, newY);

    // actor, map/cell/tiles, game, global
    // - give them all a chance to handle this

    // if (action.defaultPrevented) return;

    if (actor.forbidsCell(newCell)) {
        if (action.try) return action.didNothing();
        if (actor.isPlayer()) {
            FX.hit(map, newCell, 'hit', 100);
            GWU.message.addAt(
                newCell.x,
                newCell.y,
                '{{you}} {{verb bump~}} into {{a cell}}.',
                { actor, cell: newCell }
            );
        }
        actor.clearGoal();
        actor.endTurn();
        return action.didSomething();
    }

    if (newCell.blocksMove()) {
        if (action.try) return action.didNothing();
        FX.hit(map, newCell, 'hit', 100);
        actor.clearGoal();
        actor.endTurn();
        return action.didSomething();
    }

    // can we leave?
    if (!currentCell.canRemoveActor(actor)) {
        if (action.try) return action.didNothing();
        // canActorLeave must add appropriate message
        actor.endTurn();
        return action.didSomething();
    }

    // is there an actor there?
    if (newCell.hasActor() || newCell.hasItem()) {
        if (action.try) return action.didNothing();
        action.target = newCell.actor;
        action.item = newCell.item;
        return bump(action);
    }

    // can we enter?
    if (!newCell.canAddActor(actor)) {
        if (action.try) return action.didNothing();
        actor.endTurn();
        return action.didSomething();
    }

    if (!map.moveActor(actor, newX, newY)) {
        return standStill(action);
    }

    let rate = 100;
    if (newCell.hasTileFlag(Flags.Tile.T_DEEP_WATER)) {
        rate = 150;
    }

    actor.endTurn(rate);
    return action.didSomething();
}

ACTION.install('moveDir', moveDir);
