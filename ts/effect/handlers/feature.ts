import * as Effect from '../effect';

export function makeFeatureHandler(id: any): Effect.EffectFn {
    if (Array.isArray(id)) id = id[0];
    if (id && typeof id !== 'string') {
        id = id.id;
    }
    if (!id || !id.length) throw new Error('Feature effect needs ID');

    return featureEffect.bind(undefined, id);
}

export function featureEffect(
    id: string,
    loc: Effect.MapXY,
    ctx?: Effect.EffectCtx
): boolean {
    const feat = Effect.installedEffects[id];
    if (!feat) {
        throw new Error('Failed to find feature: ' + id);
    }

    return feat.trigger(loc, ctx);
}

Effect.installHandler('feature', makeFeatureHandler);
Effect.installHandler('effect', makeFeatureHandler);
Effect.installHandler('id', makeFeatureHandler);
