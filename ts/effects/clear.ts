import * as Flags from '../flags';
import { installHandler } from '../effect';
import * as ACTION from '../action';

export function clear(config: any): ACTION.ActionFn {
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

    return clearAction.bind(undefined, layers);
}

export function clearAction(layers: number, action: ACTION.Action): void {
    if (!layers) return action.didNothing();

    const cell = action.map.cell(action.x, action.y);
    if (cell.clearDepth(layers)) {
        action.didSomething();
    } else {
        action.didNothing();
    }
}

installHandler('clear', clear);
