/*
    Attributes
    ========================

    To configure attributes, set the defaults:

    Attribute.install(')

    const attr = new Attributes(10);

    attr.set('str', 10);
    attr.set('dex', 10);
    ...
    attr.set('chr', 10);

    // to get the current value
    attr.get('str');

    // To raise an attribute permanently
    attr.gain('chr', 1);

    // To raise an attribute temporarily
    attr.gain('chr', 1, false);

    // To lower an attribute permanently
    attr.drain('chr', 1, true);

    // to lower an attribute temporarily
    attr.drain('chr', 1);

    // to restore (remove) all temporary changes
    attr.restore();

    // to add a temporary change that can be removed by itself
    attr.addBonus('str', 1);

    // to remove the bonus
    attr.clearBonus('str', 1);

    // adjustments (bonuses) are also possible via:
    attr.adjust('str', { bonus: 1 });

    // But adjustments can also set the
    attr.adjust('str', { fixed: 14 });      // temporarily sets base
    attr.adjust('str', { base: 21 });       // resets the base
    attr.adjust('str', { restore: true });  // removes all bonuses/penalties
    attr.adjust('str', { min: 10 });        // limits value
    attr.adjust('str', { max: 30 });        // limits value
    attr.adjust('str', { sustain: true });  // turns off lowering values
*/

export interface Modifier {
    bonus?: number;
}

export interface Adjustment extends Modifier {
    fixed?: number;
    min?: number;
    max?: number;
    sustain?: boolean;
    base?: number;
    restore?: boolean;
}

export type ChangeCallback = (attributes: Attributes, name: string) => any;

export class Attributes {
    _base: Record<string, number> = {};
    _max: Record<string, number> = {};
    _bonus: Record<string, Modifier[]> = {};
    _sustain: Record<string, boolean> = {};
    _value: Record<string, number> = {};
    changed: ChangeCallback | null = null;

    constructor(baseValues: Record<string, number> | number) {
        this.init(baseValues);
    }

    init(baseValues: Record<string, number> | number) {
        for (let k in attributes) {
            const v =
                typeof baseValues === 'number' ? baseValues : attributes[k];
            this.set(k, v);
        }
        if (typeof baseValues !== 'number') {
            for (let k in baseValues) {
                this.set(k, baseValues[k]);
            }
        }
    }

    forEach(fn: (v: number) => any) {
        Object.keys(attributes).forEach((k) => fn(this.get(k)));
    }

    // modifier(name: string) {
    //     return Math.floor((this.get(name) - 10) / 2);
    // }

    get(name: string): number {
        return this._value[name] || 0;
    }

    set(name: string, value = 0) {
        this._value[name] = value;
        this._base[name] = value;
        this._max[name] = value;
        this._bonus[name] = [];
        return value;
    }

    base(name: string): number {
        return this._base[name] || 0;
    }

    max(name: string): number {
        return this._max[name] || 0;
    }

    sustain(name: string): boolean {
        return this._sustain[name] || false;
    }

    gain(name: string, delta: number, raiseMax = true) {
        if (delta < 0 && this._sustain[name]) return 0;
        this._base[name] += delta;
        if (raiseMax && this._base[name] > this._max[name]) {
            this._max[name] = this._base[name];
        }
        let old = this.get(name);
        return this._calcValue(name) - old;
    }

    drain(name: string, loss: number, lowerMax = false) {
        if (loss < 0) loss = -loss;
        const changed = this.gain(name, -loss, false);
        if (changed && lowerMax) {
            this._max[name] = this._base[name];
        }
        return changed;
    }

    restore(name: string) {
        this._base[name] = this._max[name];
        let old = this.get(name);
        return this._calcValue(name) - old;
    }

    addBonus(name: string, bonus: number) {
        return this._addBonus(name, { bonus });
    }

    _addBonus(name: string, bonus: Adjustment) {
        if (typeof bonus === 'number') bonus = { bonus };
        if (this._value[name] === undefined) {
            this.set(name, 0);
        }
        this._bonus[name].push(bonus);
        let old = this.get(name);
        return this._calcValue(name) - old;
    }

    clearBonus(name: string, bonus: number) {
        return this._clearBonus(name, { bonus });
    }

    _clearBonus(name: string, bonus: number | Adjustment) {
        if (typeof bonus === 'number') bonus = { bonus };
        let arr = this._bonus[name] || [];

        let key = JSON.stringify(bonus);
        let index = arr.findIndex((o) => {
            return JSON.stringify(o) == key;
        });
        if (index > -1) {
            arr.splice(index, 1);
            let old = this.get(name);
            return this._calcValue(name) - old;
        }
        return 0;
    }

    _calcValue(name: string) {
        let allAdjustments: Adjustment = {};
        this._bonus[name].forEach((adj) =>
            this._applyAdjustment(allAdjustments, adj)
        );
        this._sustain[name] = allAdjustments.sustain || false;
        let value = this._base[name] || 0;

        if (allAdjustments.fixed !== undefined) {
            value = allAdjustments.fixed;
        } else {
            value += allAdjustments.bonus || 0;
            if (allAdjustments.min !== undefined) {
                value = Math.max(allAdjustments.min, value);
            }
            if (allAdjustments.max !== undefined) {
                value = Math.min(allAdjustments.max, value);
            }
        }

        return (this._value[name] = value);
    }

    adjust(name: string, adj: Adjustment | number) {
        let delta = undefined;
        if (typeof adj === 'number') {
            adj = { bonus: adj };
        }

        if (adj.base) {
            delta = this.gain(name, adj.base);
        } else if (adj.restore) {
            delta = this.restore(name);
            if (delta == 0) delta = undefined;
        } else {
            delta = this._addBonus(name, adj);
        }

        if (this.changed && delta !== undefined) this.changed(this, name);

        return delta;
    }

    clearAdjustment(name: string, adj: Adjustment | number) {
        let delta = undefined;
        if (typeof adj === 'number') {
            adj = { bonus: adj };
        }

        if (adj.base) {
            delta = this.drain(name, adj.base, true);
        } else if (adj.restore) {
            // do nothing...
        } else {
            delta = this._clearBonus(name, adj);
        }

        if (this.changed && delta !== undefined) this.changed(this, name);

        return delta;
    }

    _applyAdjustment(total: Adjustment, opts: Adjustment) {
        if (opts.bonus) {
            total.bonus = (total.bonus || 0) + opts.bonus;
        }
        if (opts.fixed !== undefined) {
            total.fixed = Math.max(total.fixed || 0, opts.fixed);
        }
        if (opts.min !== undefined) {
            total.min = Math.max(total.min || 0, opts.min);
        }
        if (opts.max !== undefined) {
            total.max = Math.max(total.max || 0, opts.max);
        }
        if (opts.sustain !== undefined) {
            total.sustain = opts.sustain;
        }
    }
}

export const attributes: Record<string, number> = {};

export function installAttribute(attr: string | Record<string, number>) {
    if (typeof attr === 'string') {
        attributes[attr] = 0;
        return;
    }

    // clear existing
    Object.keys(attributes).forEach((k) => {
        delete attributes[k];
    });

    Object.assign(attributes, attr);
}

export function makeAttributes(defaults: Record<string, number>): Attributes {
    return new Attributes(defaults) as Attributes;
}

/*
function adjust(being, ...args) {
    let adj;
    if (args.length == 1 && typeof args[0] == 'number') {
        adj = RUT.Attributes.map((key) => {
            return { name: key, bonus: args[0] };
        });
    } else {
        adj = normalize_adjustment(args);
    }

    let results = adj.reduce((out, a) => {
        let delta = undefined;
        if (a.base) {
            delta = being.attributes.addBase(a.name, a.base);
        } else if (a.restore) {
            delta = being.attributes.restoreBase(a.name);
            if (delta == 0) delta = undefined;
        } else {
            delta = being.attributes.addBonus(a.name, a);
        }
        if (delta !== undefined) {
            out[a.name] = delta;
        }
        return out;
    }, {});
    being.changed({ attributes: results });

    return results;
};

 function clearAdjustment(being, ...args) {
    let adj;
    if (args.length == 1 && typeof args[0] == 'number') {
        adj = RUT.Attributes.map((key) => {
            return { name: key, bonus: args[0] };
        });
    } else {
        adj = normalize_adjustment(args);
    }

    let results = adj.reduce((out, a) => {
        let delta = 0;
        delta += being.attributes.clearBonus(a.name, a);

        out[a.name] = delta;
        return out;
    }, {});
    being.changed({ attributes: results });
    return results;
};

RUT.Attribute.rollAttributes = function (opts = {}) {
    let dice = [];
    let total = 0;

    if (RUT.Calc.isValue(opts)) opts = { value: opts };
    Object.defaults(opts, RUT.Config.Attribute.rollAttributes);

    let attributes = RUT.Config.Attributes;

    let min_average = Math.max(opts.min_average - 5, 0);
    let max_average = Math.min(opts.max_average - 5, RUT.Config.ATTRIBUTE_MAX);

    let min_total = min_average * attributes.length;
    let max_total = max_average * attributes.length;

    do {
        total = 0;
        dice = [];
        for (let i = 0; i < 18; ++i) {
            dice.push(RUT.RNG.rollDie(3 + (i % 3)));
            total += dice[i];
        }
    } while (total <= min_total || total > max_total);

    let values = attributes.reduce((out, name, i) => {
        let index = 3 * i;
        let value = 5 + dice[index] + dice[index + 1] + dice[index + 2];
        if (opts.value) {
            value = RUT.Calc.calc(opts.value);
        } else if (opts[name]) {
            value = RUT.Calc.calc(opts[name]);
        }
        out[name] = value;
        return out;
    }, {});
    return values;
};
RUT.Config.Attribute.rollAttributes = { min_average: 11, max_average: 14 };
*/

/*
export function normalize_adjustment(args: ) {
    if (args.length == 3) {
        let opts = args[2];
        if (RUT.Calc.isValue(opts)) {
            opts = { bonus: opts };
        }
        let name = `${args[0]}.${args[1]}`;
        return [Object.assign({ name }, opts)];
    }
    if (args.length == 2) {
        let opts = args[1];
        if (opts === true || opts === false) {
            opts = { has: opts };
        } else if (RUT.Calc.isValue(opts)) {
            opts = { bonus: opts };
        }
        return [Object.assign({ name: args[0] }, opts)];
    }

    let opts = args[0];
    if (opts.name) {
        return [opts];
    }
    if (opts.attribute) {
        opts.name = opts.attribute;
        return [opts];
    }
    if (opts.restore) {
        if (opts.restore == 'all') {
            return RUT.Attributes.map((a) => {
                return { name: a, restore: true };
            });
        }
        return [{ name: opts.restore, restore: true }];
    }
    if (opts.skill) {
        opts.name = opts.skill;
        return [opts];
    }
    if (opts.stat) {
        opts.name = opts.stat;
        return [opts];
    }
    if (opts.save) {
        opts.name = opts.save;
        return [opts];
    }
    // if (opts.saves) {
    //   opts.name = opts.saves;
    //   return [opts];
    // }
    if (opts.ability) {
        opts.name = opts.ability;
        return [opts];
    }

    // now we assume that each key is for a separate skill...
    return Object.keys(opts).reduce((out, key) => {
        let opt = opts[key];
        if (key == 'reset' || key == 'restore') {
            if (typeof opt == 'string') opt = [opt];
            opt.forEach((a) => {
                out.push({ name: a, restore: true });
            });
        } else {
            if (typeof opt == 'number' || Array.isArray(opt)) {
                opt = { bonus: opt };
            } else if (opt === true || opt === false) {
                opt = { has: opt };
            } else if (opt == 'reset' || opt == 'restore') {
                opt = { restore: true };
            } else if (opt == 'sustain') {
                opt = { sustain: true };
            }
            out.push(Object.assign({ name: key }, opt));
        }
        return out;
    }, []);
}
*/
