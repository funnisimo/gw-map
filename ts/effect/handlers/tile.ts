// import * as GWU from 'gw-utils';
import { SetTileOptions } from '../../map';

import { installHandler, EffectFn, EffectCtx, MapXY } from '../effect';

//////////////////////////////////////////////
// EMIT

export interface TileEffectOptions extends SetTileOptions {
    id: string;
}

export function makeTileHandler(src: any): EffectFn {
    if (!src) throw new Error('Tile effect needs configuration.');

    if (typeof src === 'string') {
        src = { id: src };
    } else if (Array.isArray(src)) {
        src = { id: src[0] };
    } else if (!src.id) {
        throw new Error('Tile effect needs configuration with id.');
    }

    const opts: TileEffectOptions = src;
    if (opts.id.includes('!')) {
        opts.superpriority = true;
    }
    if (opts.id.includes('~')) {
        opts.blockedByActors = true;
        opts.blockedByItems = true;
    }
    opts.id = opts.id.replace(/[!~]*/g, '');

    return tileEffect.bind(opts) as EffectFn;
}

export function tileEffect(
    this: TileEffectOptions,
    loc: MapXY,
    ctx: EffectCtx
): boolean {
    this.machine = ctx.machine || 0;
    const didSomething = loc.map.setTile(loc.x, loc.y, this.id, this);
    return didSomething;
}

installHandler('tile', makeTileHandler);
