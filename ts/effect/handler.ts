// @ts-nocheck

import { EffectConfig, EffectInfo, EffectCtx } from './types';
import { MapType } from '../map/types';

export class Handler {
    make(src: Partial<EffectConfig>, dest: EffectInfo): boolean {
        return true;
    }

    fire(
        config: EffectInfo,
        map: MapType,
        x: number,
        y: number,
        ctx: EffectCtx
    ): Promise<boolean> | boolean {
        return false;
    }
}

export const handlers: Record<string, Handler> = {};

export function installHandler(id: string, handler: Handler) {
    handlers[id] = handler;
}
