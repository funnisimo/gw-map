// import * as GWU from 'gw-utils';
import { SetTileOptions } from '../map';
import * as ACTION from '../action';
import { installHandler } from '../effect';
import * as Flags from '../flags';

//////////////////////////////////////////////
// EMIT

export interface TileEffectOptions extends SetTileOptions {
    id: string;
    protected?: boolean;
}

export function tile(src: any): ACTION.ActionFn {
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
    if (opts.id.includes('+')) {
        opts.protected = true;
    }
    opts.id = opts.id.replace(/[!~+]*/g, '');

    return tileAction.bind(undefined, opts);
}

export function tileAction(
    cfg: TileEffectOptions,
    action: ACTION.Action
): void {
    const map = action.map;
    cfg.machine = action.machine || 0;
    if (map.setTile(action.x, action.y, cfg.id, cfg)) {
        if (cfg.protected) {
            map.setCellFlag(action.x, action.y, Flags.Cell.EVENT_PROTECTED);
        }
        action.didSomething();
    }
}

installHandler('tile', tile);
