import * as ACTION from '../action';

export function standStill(action: ACTION.Action): void {
    if (action.actor) {
        action.actor.endTurn();
        action.didSomething();
    }
}

ACTION.install('standStill', standStill);
