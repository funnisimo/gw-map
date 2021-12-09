import * as Flags from '../../flags';
import { installHandler, EffectFn, EffectCtx, MapXY } from '../effect';

export function makeClearHandler(config: any): EffectFn {
    let layers = 0;

    if (!config) {
        layers = Flags.Depth.ALL_LAYERS;
    } else if (typeof config === 'number') {
        layers = config;
    } else if (typeof config === 'string') {
        const parts = config.split(/[,|]/g);
        layers = parts.reduce((out: number, v: string | number) => {
            if (typeof v === 'number') return out | v;

            const depth: number =
                Flags.Depth[v as keyof typeof Flags.Depth] || 0;
            return out | depth;
        }, 0);
    } else {
        throw new Error(
            'Invalid config for clear effect: ' + JSON.stringify(config)
        );
    }

    return clearEffect.bind(undefined, layers) as EffectFn;
}

export function clearEffect(
    layers: number,
    loc: MapXY,
    _ctx: EffectCtx
): boolean {
    if (!layers) return false;

    const cell = loc.map.cell(loc.x, loc.y);
    return cell.clearDepth(layers);
}

installHandler('clear', makeClearHandler);
