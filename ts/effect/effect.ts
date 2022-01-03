import * as GWU from 'gw-utils';

import * as Actor from '../actor';
import * as Item from '../item';
import * as Map from '../map';

///////////////////////////
// CONTEXT

export interface EffectCtx {
    // tile?: Tile;
    // cell?: Map.Cell;

    actor?: Actor.Actor | null;
    // readonly target?: Actor.Actor | null;
    item?: Item.Item | null;
    key?: Item.Item | Actor.Actor | null;
    player?: Actor.Actor | null;

    aware?: boolean;
    identified?: boolean;
    machine?: number;

    force?: boolean;
    good?: boolean;
    seen?: boolean;

    originX?: number;
    originY?: number;

    rng?: GWU.rng.Random;
}

/////////////////////////
// HANDLERS

export interface MapXY {
    map: Map.Map;
    x: number;
    y: number;
}

export type EffectFn = (xy: MapXY, ctx?: EffectCtx) => boolean;

export type HandlerFn = (
    config: string | string[] | Record<string, any>
) => EffectFn;

export const handlers: Record<string, HandlerFn> = {};

export function installHandler(id: string, handler: HandlerFn) {
    handlers[id.toLowerCase()] = handler;
}

/////////////////////////
// TYPES

export type MakeEffectFn = (config: any) => Effect;

export const effectTypes: Record<string, MakeEffectFn> = {};

export function installType(id: string, type: MakeEffectFn) {
    effectTypes[id] = type;
}

//////////////////////////
// EFFECT

export interface Effect {
    chance: number; //  100 * 100 =  100%
    seen: boolean;
    effects: EffectFn[];
    next: Effect | null;

    trigger(loc: MapXY, ctx?: EffectCtx): boolean;
    clone(): this;
}

//////////////////////////
// MAKE

export interface EffectConfig {
    chance?: number | string;
    type?: string; // basic | bolt | beam | ball | burst | adjacent | spread

    effects: string | EffectFn | (string | EffectFn)[] | Record<string, any>;
    good?: boolean;
    flags?: GWU.flag.FlagBase;

    next?: EffectBase;

    [key: string]: any;
}

export type EffectBase =
    | string
    | EffectFn
    | (string | EffectFn)[]
    | EffectConfig
    | Record<string, any>;

// export class Effect {
//     id = '';
//     chance = 100 * 100; // 100%
//     type: string; // self | bolt | beam | ball | burst | adjacent | spread
//     aim: string; // actor | item | cell
//     bolt: string | GWU.sprite.SpriteData | null = null;
//     beam = false;
//     range = 0;
//     ball: string | GWU.sprite.SpriteData | null = null;
//     radius = 0;
//     center = false;
//     effects: EffectFn[];
//     good = false;
//     seen = false;
//     next: Effect | null = null;

//     constructor(config: EffectConfig) {
//         if (typeof config.effects === 'string') {
//             config.effects = [config.effects];
//         } else if (typeof config.effects === 'function') {
//             config.effects = [config.effects];
//         }

//         this.aim = config.aim || 'actor';

//         if (typeof config.chance === 'string') {
//             // '20%' becomes 2000
//             config.chance = Math.floor(Number.parseFloat(config.chance) * 100);
//         }
//         this.chance = config.chance || 100 * 100;

//         const type = config.type || 'basic';
//         const parts = type.split(':');

//         if (type.startsWith('bolt') || type.startsWith('beam')) {
//             // bolt:range:sprite
//             this.type = parts[0];
//             this.range = parts[1] ? Number.parseInt(parts[1]) : 99;
//             this.bolt = parts[1] || 'missile';
//             this.beam = type.startsWith('beam');
//         } else if (
//             type.startsWith('ball') ||
//             type.startsWith('burst') ||
//             type.startsWith('aura')
//         ) {
//             this.type = parts[0];
//             this.radius = parts[1] ? Number.parseInt(parts[1]) : 2;
//             this.range = parts[2] ? Number.parseInt(parts[2]) : 99;
//             this.ball = parts[3] || 'explosion';
//             this.center = !type.startsWith('aura');
//         } else {
//             this.type = 'basic';
//         }

//         if (typeof config.effects === 'string') {
//             config.effects = [config.effects];
//         } else if (typeof config.effects === 'function') {
//             config.effects = [config.effects];
//         }

//         if (Array.isArray(config.effects)) {
//             this.effects = config.effects.map((e) => {
//                 if (typeof e === 'function') return e;
//                 return effectFnFromString(e);
//             });
//         } else {
//             this.effects = [];
//             Object.entries(config.effects).forEach(([key, value]) => {
//                 const handler = handlers[key.toLowerCase()];
//                 if (handler) {
//                     this.effects.push(handler(value));
//                 } else if (typeof value === 'function') {
//                     this.effects.push(value);
//                 } else {
//                     throw new Error('Unknown effect: ' + key);
//                 }
//             });
//         }
//         if (this.effects.length === 0) throw new Error('No effects!');
//     }

//     clone(): this {
//         const other = new (this.constructor as new (
//             config: EffectConfig
//         ) => this)(this as EffectConfig);
//         return other;
//     }

//     fire(map: Map.MapType, x: number, y: number, ctx: EffectCtx = {}): boolean {
//         let didSomething = false;
//         ctx.good = this.good;
//         ctx.seen = this.seen;
//         if (!this.chance || map.rng.chance(this.chance, 10000)) {
//             // fire
//             for (let effect of this.effects) {
//                 if (GWU.data.gameHasEnded) break;
//                 if (effect(map, x, y, ctx)) {
//                     didSomething = true;
//                 } else {
//                     break;
//                 }
//             }
//         }

//         if (ctx.aware && didSomething) {
//             this.seen = true;
//         }
//         this.good = ctx.good;

//         return didSomething;
//     }

//     reset() {
//         this.seen = false;
//     }
// }

// export function effectFnFromString(e: string): EffectFn {
//     const parts = e.split(':');
//     if (parts.length === 0) throw new Error('Invalid effect string.');
//     // @ts-ignore
//     const name = parts.shift().toLowerCase();
//     const handler = handlers[name] || null;
//     if (!handler) {
//         throw new Error('Failed to find effect handler: ' + name);
//     }
//     return handler(parts);
// }

export function make(opts: EffectBase): Effect {
    if (!opts) throw new Error('opts required to make effect.');
    let config = {} as EffectConfig;

    if (typeof opts === 'string') {
        // Special case
        if (opts.toLowerCase().startsWith('spread:')) {
            const endPos = opts.indexOf(':', 8);
            const tile = opts.substring(8, endPos);
            config = {
                type: 'spread:' + opts.substring(endPos),
                effects: ['tile:' + tile],
            };
        } else {
            config = { type: 'basic', effects: [opts] };
        }
    } else if (typeof opts === 'function') {
        config = { type: 'basic', effects: [opts] };
    } else if (Array.isArray(opts)) {
        config = { type: 'basic', effects: opts };
    } else {
        // @ts-ignore
        if (opts.effect) {
            // @ts-ignore
            opts.effects = [opts.effect];
            delete opts.effect;
        }

        // object only
        if (opts.effects) {
            Object.assign(config, opts);
            if (typeof config.effects === 'string') {
                config.effects = [opts.effects];
            } else if (typeof config.effects === 'function') {
                config.effects = [opts.effects];
            }
        } else {
            config.effects = {} as Record<string, any>;
            Object.entries(opts).forEach(([key, value]) => {
                const handler = handlers[key.toLowerCase()];
                if (handler !== undefined) {
                    // @ts-ignore
                    config.effects[key] = value;
                } else if (typeof value === 'function') {
                    // @ts-ignore
                    config.effects[key] = value;
                } else {
                    // @ts-ignore
                    config[key] = value;
                }
            });
        }
    }

    config.type = config.type || 'basic';

    if (typeof config.type !== 'string')
        throw new Error('Invalid effect type: ' + JSON.stringify(config.type));

    const typeParts = config.type.split(':').map((t) => t.trim());
    const typeName = typeParts.shift()!;

    const makeFn = effectTypes[typeName.toLowerCase()];
    if (!makeFn) throw new Error('Invalid effect type: ' + typeName);

    const effect = makeFn(config);

    if (Array.isArray(config.effects)) {
        config.effects.forEach((e: string | EffectFn) => {
            if (typeof e === 'function') {
                effect.effects.push(e);
            } else {
                const parts = e.split(':').map((t: string) => t.trim());

                if (parts.length === 1) {
                    const effect = installedEffects[parts[0]];
                    if (!effect)
                        throw new Error(
                            'Failed to find effect with id: ' + parts[0]
                        );
                    effect.effects.push(effect.trigger.bind(effect));
                } else {
                    const handler = handlers[parts[0].toLowerCase()];
                    if (!handler)
                        throw new Error('Unknown effect: ' + parts[0]);
                    parts.shift();
                    effect.effects.push(handler(parts));
                }
            }
        });
    } else {
        Object.entries(config.effects).forEach(([key, value]) => {
            const handler = handlers[key.toLowerCase()];
            if (!handler)
                throw new Error('Failed to find handler type: ' + key);

            effect.effects.push(handler(value));
        });
    }

    if (config.next) {
        effect.next = make(config.next);
    }

    return effect;
}

export function from(opts: EffectBase): Effect {
    if (!opts) throw new Error('Cannot make effect from null | undefined');
    if (typeof opts === 'object' && 'trigger' in opts) {
        return opts as Effect;
    }

    if (typeof opts === 'string') {
        const effect = installedEffects[opts];
        if (effect) return effect;
        throw new Error('Unknown effect - ' + opts);
    }
    return make(opts);
}

function isEffect(obj: any): obj is Effect {
    return typeof obj === 'object' && 'trigger' in obj;
}

//////////////////////////////
// INSTALL

export const installedEffects: Record<string, Effect> = {};

export function install(id: string, config: EffectBase): Effect {
    const effect = isEffect(config) ? (config.clone() as Effect) : make(config);
    installedEffects[id] = effect;
    return effect;
}

export function installAll(effects: Record<string, EffectBase>) {
    Object.entries(effects).forEach(([id, config]) => {
        install(id, config);
    });
}

export function resetAll() {
    Object.values(installedEffects).forEach((e) => (e.seen = false));
}
