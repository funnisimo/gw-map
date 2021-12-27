import * as GWU from 'gw-utils';

/*
STATS

// Stats are counting stats that (generally) go up and down.
// They can be adjusted temporarily or permanently.
// And they can be restored.
// They will commonly be used for things like player health, nutrition, energy, and magic points.

const stats = new Stats();

// to set, adjust, get
stats.set('health', 50);   // sets current value (and max) to 50
stats.gain('health', 10);   // increase health by 10, limited by max
stats.gain('health', 5, true); // increase health by 5, allow going over max
stats.drain('health', 10);  // reduce health by 10
stats.get('health');

// You can set the max and value separately when you set a stat
stats.set('energy', 50, 100); // so 50 out of 100 energy

// you can also supply range values
stats.set('mana', '2d6');
stats.gain('mana', '1d4');
stats.drain('mana', '1d2+8');

// you can also restore
stats.restore('health');    // returns health to its max value (100%)
stats.restore('health', 50); // return health to at least 50

// You can also configure stats to regenerate over time
// the setting is the # turns and the # gained
stats.setRegen('health', 10);  // regen 1 health every 10 turns
stats.setRegen('health', 3, 2); // regen 2 health every 3 turns

// to cause the regeneration to occur
stats.regenAll();

// Increases
// it is common to add to stats as a player levels up...
stats.raiseMax('health', '2d6');    // raise health 2d6, raise current value the same amount
stats.raiseMax('mana', 20, false);  // raise mana + 20, do not raise current value

// Decreases
// If you have a level down mechanism, you can lower the max as well
stats.reduceMax('health', 20);
stats.reduceMax('mana', '2d6', false);  // do no lower current value

// TODO - use percents
stats.restore('health', '100%');
stats.gain('health', '10%');
stats.drain('health', '10%');
*/

export type AdjustType = 'inc' | 'set' | 'dec' | 'min' | 'max';

export interface StatOptions {
    value?: number;
    max?: number;
    rate?: number;
}

export interface StatAdjustment {
    over?: number;
    bonus?: number;
    value?: GWU.range.RangeBase | boolean;
    max?: number | boolean;
    rate?: number;
    reset?: boolean;

    // identify the stat to adjust (for many)
    name?: string;
    stat?: string;
}

export interface RegenInfo {
    turns: number;
    count: number;
    elapsed: number;
}

export class Stats {
    _max: Record<string, number> = {};
    _rate: Record<string, RegenInfo> = {};
    _value: Record<string, number> = {};

    constructor(opts: Record<string, GWU.range.RangeBase> = {}) {
        this.init(opts);
    }

    get(name: string): number {
        return this._value[name] || 0;
    }

    getPct(name: string): number {
        const max = this.max(name);
        return max ? Math.round((100 * this.get(name)) / max) : 0;
    }

    max(name: string): number {
        return this._max[name] || 0;
    }

    regen(name: string): RegenInfo | null {
        return this._rate[name] || null;
    }

    init(opts: Record<string, GWU.range.RangeBase>) {
        for (let name in opts) {
            this.set(name, opts[name]);
        }
    }

    set(name: string, v: GWU.range.RangeBase, max?: number): void {
        if (typeof v !== 'number') {
            const r = GWU.range.make(v);
            v = r.value();
        }
        this._value[name] = v;
        this._max[name] = max || v;
    }

    gain(name: string, amount: GWU.range.RangeBase, allowOver = false) {
        if (typeof amount !== 'number') {
            amount = GWU.range.value(amount);
        }
        let v = this._value[name] + amount;
        if (!allowOver) {
            v = Math.min(v, this._max[name]);
        }
        this._value[name] = v;
    }

    drain(name: string, amount: GWU.range.RangeBase) {
        if (typeof amount !== 'number') {
            amount = GWU.range.value(amount);
        }
        this._value[name] = Math.max(0, this._value[name] - amount);
    }

    raiseMax(name: string, amount: GWU.range.RangeBase, raiseValue = true) {
        if (typeof amount !== 'number') {
            amount = GWU.range.value(amount);
        }
        this._max[name] += amount;
        if (raiseValue) {
            this.gain(name, amount);
        }
    }

    reduceMax(name: string, amount: GWU.range.RangeBase, lowerValue = false) {
        if (typeof amount !== 'number') {
            amount = GWU.range.value(amount);
        }
        this._max[name] = Math.max(0, this._max[name] - amount);
        if (lowerValue) {
            this.drain(name, amount);
        }
    }

    setRegen(name: string, turns: number, count = 1) {
        const r = (this._rate[name] = this._rate[name] || { elapsed: 0 });
        r.turns = turns;
        r.count = count;
    }

    regenAll() {
        for (let name in this._max) {
            const r = this._rate[name];
            r.elapsed += 1;
            if (r.elapsed >= r.turns) {
                this.gain(name, r.count);
                r.elapsed -= r.turns;
            }
        }
    }

    restore(name: string, value?: number) {
        if (value === undefined) value = this._max[name];
        this._value[name] = value;
    }

    adjust(
        name: string,
        type: AdjustType,
        amount: GWU.range.RangeBase
    ): boolean {
        amount = GWU.range.from(amount);
        const v = amount.value();
        const c = this.get(name);

        if (type === 'inc') {
            this.gain(name, amount);
        } else if (type === 'dec') {
            this.drain(name, amount);
        } else if (type === 'set') {
            this.set(name, amount);
        } else if (type === 'min') {
            const v = amount.value();
            if (this.get(name) < v) {
                this.set(name, v);
            }
        } else if (type === 'max') {
            if (this.get(name) > v) {
                this.set(name, v);
            }
        } else {
            throw new Error('Invalid stat adjust type: ' + type);
        }

        return c !== this.get(name);
    }
}
