import * as GWU from 'gw-utils';
import { MapType } from '../map/types';

import { EffectInfo, EffectCtx } from './types';
import { Effect as Flags } from '../flags';

import { handlers } from './install';
import { from } from './make';

export async function fire(
    effect: EffectInfo | string,
    map: MapType,
    x: number,
    y: number,
    ctx_: Partial<EffectCtx> = {}
): Promise<boolean> {
    if (!effect) return false;
    if (typeof effect === 'string') {
        const name = effect;
        effect = from(name);
        if (!effect) throw new Error('Failed to find effect: ' + name);
    }

    const ctx = ctx_ as EffectCtx;
    if (
        !ctx.force &&
        effect.chance &&
        !GWU.rng.random.chance(effect.chance, 10000)
    )
        return false;

    const grid = (ctx.grid = GWU.grid.alloc(map.width, map.height));

    let didSomething = false;
    const allHandlers = Object.values(handlers);
    for (let h of allHandlers) {
        if (await h.fire(effect, map, x, y, ctx)) {
            didSomething = true;
        }
    }

    // do the next effect - if applicable
    if (
        effect.next &&
        (didSomething || effect.flags & Flags.E_NEXT_ALWAYS) &&
        !GWU.data.gameHasEnded
    ) {
        const nextInfo =
            typeof effect.next === 'string' ? from(effect.next) : effect.next;
        if (effect.flags & Flags.E_NEXT_EVERYWHERE) {
            await grid.forEachAsync(async (v, i, j) => {
                if (!v) return;
                didSomething =
                    (await fire(nextInfo, map, i, j, ctx)) || didSomething;
            });
        } else {
            didSomething =
                (await fire(nextInfo, map, x, y, ctx)) || didSomething;
        }
    }

    // bookkeeping
    if (
        didSomething &&
        map.isVisible(x, y) &&
        !(effect.flags & Flags.E_NO_MARK_FIRED)
    ) {
        effect.flags |= Flags.E_FIRED;
    }

    GWU.grid.free(grid);
    return didSomething;
}

export function fireSync(
    effect: EffectInfo | string,
    map: MapType,
    x: number,
    y: number,
    ctx_: Partial<EffectCtx> = {}
): boolean {
    if (!effect) return false;
    if (typeof effect === 'string') {
        const name = effect;
        effect = from(name);
        if (!effect) throw new Error('Failed to find effect: ' + name);
    }

    const ctx = ctx_ as EffectCtx;
    if (
        !ctx.force &&
        effect.chance &&
        !GWU.rng.random.chance(effect.chance, 10000)
    )
        return false;

    const grid = (ctx.grid = GWU.grid.alloc(map.width, map.height));

    let didSomething = false;
    const allHandlers = Object.values(handlers);
    for (let h of allHandlers) {
        if (h.fireSync(effect, map, x, y, ctx)) {
            didSomething = true;
        }
    }

    // bookkeeping
    if (
        didSomething &&
        map.isVisible(x, y) &&
        !(effect.flags & Flags.E_NO_MARK_FIRED)
    ) {
        effect.flags |= Flags.E_FIRED;
    }

    // do the next effect - if applicable
    if (
        effect.next &&
        (didSomething || effect.flags & Flags.E_NEXT_ALWAYS) &&
        !GWU.data.gameHasEnded
    ) {
        const nextInfo =
            typeof effect.next === 'string' ? from(effect.next) : effect.next;
        if (effect.flags & Flags.E_NEXT_EVERYWHERE) {
            grid.forEach(async (v, i, j) => {
                if (!v) return;
                fireSync(nextInfo, map, i, j, ctx);
            });
        } else {
            fireSync(nextInfo, map, x, y, ctx);
        }
    }

    GWU.grid.free(grid);
    return didSomething;
}
