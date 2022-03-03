import { installHandler } from '../effect';
import * as ACTION from '../action';

//////////////////////////////////////////////
// ActivateMachine

export function activateMachine(): ACTION.ActionFn {
    return activateMachineAction.bind(undefined);
}

export function activateMachineAction(action: ACTION.Action): void {
    const map = action.map;

    const cell = map.cell(action.x, action.y);
    const machine = cell.machineId;
    if (!machine) return action.didNothing();

    action.originX = action.x;
    action.originY = action.y;
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            const cell = map.cell(x, y);
            if (cell.machineId !== machine) continue;
            cell.trigger('machine', action); // will set didSomething or didNothing
        }
    }
}

installHandler('activateMachine', activateMachine);
