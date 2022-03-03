import { installHandler } from '../effect';
import * as ACTION from '../action';

//////////////////////////////////////////////
// EMIT

export function emit(config: any): ACTION.ActionFn {
    if (Array.isArray(config)) config = config[0];
    if (typeof config !== 'string')
        throw new Error('Invalid EMIT handler config - ' + config);

    return emitAction.bind(undefined, config);
}

export function emitAction(id: string, action: ACTION.Action): void {
    action.actor && action.actor.trigger(id, action);
    if (action.isDone()) return;
    action.item && action.item.trigger(id, action);
    if (action.isDone()) return;
    action.map.trigger(id, action);
    if (action.isDone()) return;
    action.game.trigger(id, action);
}

installHandler('emit', emit);
