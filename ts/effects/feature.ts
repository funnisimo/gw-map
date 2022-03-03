import * as Effect from '../effect';
import * as ACTION from '../action';

export function feature(
    id: string | string[] | { id: string }
): ACTION.ActionFn {
    if (Array.isArray(id)) id = id[0];
    if (id && typeof id !== 'string') {
        id = id.id;
    }
    if (!id || !id.length) throw new Error('Feature effect needs ID');

    return featureAction.bind(undefined, id);
}

export function featureAction(id: string, action: ACTION.Action): void {
    const feat = Effect.installed[id];
    if (!feat) {
        throw new Error('Failed to find feature: ' + id);
    }

    return feat(action);
}

Effect.installHandler('feature', feature);
Effect.installHandler('effect', feature);
Effect.installHandler('id', feature);
