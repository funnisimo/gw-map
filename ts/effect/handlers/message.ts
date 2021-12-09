import * as GWU from 'gw-utils';

import { installHandler, EffectFn, EffectCtx, MapXY } from '../effect';

//////////////////////////////////////////////
// MESSAGE

export function makeMessageHandler(src: any): EffectFn {
    if (Array.isArray(src)) src = src[0];
    if (typeof src !== 'string') {
        throw new Error('Need message for message effect.');
    }

    const info = {
        msg: src,
    };

    return messageEffect.bind(undefined, info) as EffectFn;
}

export function messageEffect(
    info: { msg: string },
    loc: MapXY,
    ctx: EffectCtx
): boolean {
    const seen = ctx.seen;
    const msg = info.msg;

    if (
        msg &&
        msg.length &&
        ctx.aware &&
        !seen
        // && map.isVisible(x, y)
    ) {
        GWU.message.addAt(loc.x, loc.y, msg, ctx);
        return true;
    }
    return false;
}

installHandler('msg', makeMessageHandler);
