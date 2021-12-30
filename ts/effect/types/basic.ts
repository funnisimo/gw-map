import * as GWU from 'gw-utils';
import * as Effect from '../effect';
import * as Flags from '../../flags';

export class BasicEffect implements Effect.Effect {
    effects: Effect.EffectFn[] = [];
    chance = 100 * 100; // 100%
    seen = false;
    flags = 0;
    next: Effect.Effect | null = null;

    constructor(config?: string | string[] | Record<string, any>) {
        if (typeof config === 'object' && !Array.isArray(config)) {
            this.flags = GWU.flag.from(Flags.Effect, config.flags);
            if (
                typeof config.chance === 'string' &&
                config.chance.endsWith('%')
            ) {
                this.chance = Number.parseFloat(config.chance) * 100;
            } else {
                this.chance = Number.parseInt(config.chance || '10000');
            }
        }
    }

    clone(): this {
        const other = new (this.constructor as new () => this)();
        other.effects = this.effects.slice();
        other.chance = this.chance;
        other.seen = false;
        other.flags = this.flags;
        other.next = this.next;
        return other;
    }

    trigger(loc: Effect.MapXY, ctx: Effect.EffectCtx = {}): boolean {
        if (!ctx.force && this.chance) {
            const rng = ctx.rng || loc.map.rng || GWU.random;
            if (!rng.chance(this.chance, 10000)) return false;
        }

        let didSomething = false;
        for (let eff of this.effects) {
            if (eff(loc, ctx)) {
                didSomething = true;
            }
        }
        if (this.next) {
            const nextAlways = !!(this.flags & Flags.Effect.E_NEXT_ALWAYS);
            if (didSomething || nextAlways) {
                return this.next.trigger(loc, ctx);
            }
        }
        return didSomething;
    }
}

export function makeBasicEffect(config: any): BasicEffect {
    if (typeof config !== 'object') {
        return new BasicEffect();
    }
    return new BasicEffect(config);
}

Effect.installType('basic', makeBasicEffect);
