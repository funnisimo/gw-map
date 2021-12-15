import { installHandler, EffectFn, EffectCtx, MapXY } from '../effect';

//////////////////////////////////////////////
// EMIT

export function makeEmitHandler(config: any): EffectFn {
    if (Array.isArray(config)) config = config[0];
    if (typeof config !== 'string')
        throw new Error('Invalid EMIT handler config - ' + config);

    return emitEffect.bind(undefined, config) as EffectFn;
}

export function emitEffect(id: string, loc: MapXY, ctx: EffectCtx): boolean {
    return loc.map.events.emit(id, loc, ctx);
}

installHandler('emit', makeEmitHandler);
