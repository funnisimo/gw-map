import { EffectFn, EffectCtx, installHandler, MapXY } from '../effect';

//////////////////////////////////////////////
// ActivateMachine

export function makeActivateMachine(): EffectFn {
    return activateMachine.bind(undefined) as EffectFn;
}

export function activateMachine(loc: MapXY, ctx: EffectCtx): boolean {
    const cell = loc.map.cell(loc.x, loc.y);
    const machine = cell.machineId;
    if (!machine) return false;

    return loc.map.activateMachine(machine, loc.x, loc.y, ctx);
}

installHandler('activateMachine', makeActivateMachine);
