/*
Skills

Skills generally fall into 2 categories - binary and progressive.


// Create a skills object
const skills = new Skills();

// set skills
skills.set('diving', true); // = { has: true, level: 0 }
skills.set('diving', 10); // = { has: true, level: 10 }

skills.remove('diving'); // {}

// adjustments
skills.adjust('diving', { bonus: 1 });
skills.adjust('diving', { disadvantage: true });
skills.adjust('diving', { advantage: 3 });
skills.adjust('diving', { fixed: 10 });
skills.adjust('diving', { critical: 5 });





*/

// RUT.Skill.make = function(has, advantage, disadvantage) {
//   let result = {};
//   if (has !== undefined) result.has = has;
//   if (advantage !== undefined) result.advantage = advantage;
//   if (disadvantage !== undefined) result.disadvantage = disadvantage;
//   return result;
// }
// RUT.Skill.add = function(result, b) {
//   if (b === true || b === false ) { b = { has: b }; }
//   for(let k in b) {
//     let value = b[k];
//     if (value === undefined) continue;
//     if (value === false && result[k]) {
//       delete result[k];
//     }
//     else if (k == 'name') {
//       continue;
//     }
//     else if (k == 'bonus') {
//       result.bonus = (result.bonus || 0) + value;
//     }
//     else if (k == 'fixed') {
//       result.fixed = Math.max(result.fixed || 0, value);
//     }
//     else {
//       result[k] = value;
//     }
//   }
//   return result;
// }
// RUT.Skill.mix = function(a, b) {
//   let result = {};
//   RUT.Skill.add(result, a);
//   RUT.Skill.add(result, b);
//   return result;
// }

// function normalize_adjustment(args) {
//   if (args.length == 3) {
//     let opts = args[2];
//     if (RUT.Calc.isValue(opts)) {
//       opts = { bonus: opts };
//     }
//     let name = `${args[0]}.${args[1]}`
//     return [Object.assign({ name }, opts)];
//   }
//   if (args.length == 2) {
//     let opts = args[1];
//     if (opts === true || opts === false) {
//       opts = { has: opts };
//     }
//     else if (RUT.Calc.isValue(opts)) {
//       opts = { bonus: opts };
//     }
//     return [Object.assign({ name: args[0] }, opts)];
//   }

//   let opts = args[0];
//   if (opts.name) {
//     return [opts];
//   }
//   if (opts.attribute) {
//     opts.name = opts.attribute;
//     return [opts];
//   }
//   if (opts.restore) {
//     if (opts.restore == 'all') {
//       return RUT.Attributes.map( (a) => { return { name: a, restore: true }; });
//     }
//     return [{ name: opts.restore, restore: true }];
//   }
//   if (opts.skill) {
//     opts.name = opts.skill;
//     return [opts];
//   }
//   if (opts.stat) {
//     opts.name = opts.stat;
//     return [opts];
//   }
//   if (opts.save) {
//     opts.name = opts.save;
//     return [opts];
//   }
//   // if (opts.saves) {
//   //   opts.name = opts.saves;
//   //   return [opts];
//   // }
//   if (opts.ability) {
//     opts.name = opts.ability;
//     return [opts];
//   }

//   // now we assume that each key is for a separate skill...
//   return Object.keys(opts).reduce( (out, key) => {
//     let opt = opts[key];
//     if (key == 'reset' || key == 'restore') {
//       if (typeof opt == 'string') opt = [opt];
//       opt.forEach( (a) => {
//         out.push({ name: a, restore: true });
//       });
//     }
//     else {
//       if (typeof opt == 'number' || Array.isArray(opt)) {
//         opt = { bonus: opt };
//       }
//       else if (opt === true || opt === false) {
//         opt = { has: opt };
//       }
//       else if (opt == 'reset' || opt == 'restore') {
//         opt = { restore: true };
//       }
//       else if (opt == 'sustain' ) {
//         opt = { sustain: true };
//       }
//       out.push(Object.assign({ name: key }, opt ));
//     }
//     return out;
//   }, []);
// }

// RUT.Skill.Skills = class Skills {
//   constructor(defaults={}) {
//     // this.values = {};
//     this._adjustments = {};
//     this._bases = {};

//     Object.entries(defaults).forEach( ([key, value]) => {
//       if (typeof value == 'number') {
//         this._bases[key] = { bonus: value };
//         this[key] = { bonus: value };
//         this._adjustments[key] = [];
//       }
//       else {
//         this.add(key, value);
//       }
//     });
//   }

//   add(name, advantage, disadvantage) {
//     this._add(name, true, advantage, disadvantage);
//   }

//   _add(name, has, advantage, disadvantage) {
//     this._bases[name] = RUT.Skill.make(has, advantage, disadvantage);
//     this[name] = RUT.Skill.make(has, advantage, disadvantage);
//     this._adjustments[name] = [];
//   }

//   get(name, sub) {
//     if (sub === undefined) {
//       return this[name];
//     }

//     let main = this[name];
//     let type = this[`${name}.${sub}`];

//     if (!main && !type) return undefined;
//     if (!main) return type;
//     if (!type) return main;

//     return RUT.Skill.mix(main, type);
//   }

//   adjust(...args) {
//     let opts = normalize_adjustment(args);
//     return opts.reduce( (changed, opt) => {
//       let result = true;
//       let name = opt.name;
//       let s = this._adjustments[name];
//       if (!s) {
//         this._add(name);
//         s = this._adjustments[name];
//       }
//       if (opt.reset === true) {
//         result = (s.length != 0);
//         this._adjustments[name] = [];
//       }
//       else {
//         s.push(opt);
//       }
//       this._calcValue(name);
//       return result;
//     }, false);
//   }

//   clearAdjustment(...args) {
//     let opts = normalize_adjustment(args);
//     opts.forEach( (opt) => {
//       let name = opt.name;
//       // this._adjustments[name].remove(opt);

//       let key = JSON.stringify(opt);
//       let index = this._adjustments[name].findIndex( (o) => { return JSON.stringify(o) == key; });
//       if (index > -1 ) {
//         this._adjustments[name].splice(index,1);
//         this._calcValue(name);
//       }
//     });
//   }

//   // clearMatching(skill, fn) {
//   //   let current = this._adjustments[skill] || [];
//   //   let matching = current.filter( fn );
//   //   this._adjustments[skill] = current.filter( (a) => ! fn(a) );
//   //   this._calcValue(skill);
//   //   return matching;
//   // }

//   // change(...args) {
//   //   let opts = normalize_adjustment(args);
//   //   opts.forEach( (opt) => {
//   //     let name = opt.name;
//   //     let base = this._bases[name];
//   //     RUT.Skill.add(base, opt);
//   //     this._calcValue(name);
//   //   });
//   // }

//   _calcValue(name) {
//     let value = {};
//     let base = this._bases[name];
//     RUT.Skill.add(value, base);
//     this._adjustments[name].forEach( (adjustment) => {
//       RUT.Skill.add(value, adjustment);
//     });
//     this[name] = value;
//   }

// }

export interface SkillInfo {
    has: boolean;
    level: number;
    disadvantage?: boolean;
    advantage?: boolean;
    fixed?: number;
    bonus?: number;
    succeed?: boolean;
    fail?: boolean;
}

class Skill implements Readonly<SkillInfo> {
    name: string;

    _has?: boolean;
    _level?: number;
    _disadvantage?: boolean;
    _advantage?: boolean;
    _fixed?: number;
    _bonus?: number;
    _succeed?: boolean;
    _fail?: boolean;

    _parent?: Skill;

    constructor(name: string) {
        this.name = name;
    }

    get has(): boolean {
        return this._bool('_has');
    }

    get level(): number {
        return this._int('_level');
    }

    get disadvantage(): boolean {
        return this._bool('_disadvantage');
    }

    get advantage(): boolean {
        return this._bool('_advantage');
    }

    get fixed(): number {
        return this._int('_fixed');
    }

    get bonus(): number {
        const b = this._int('_bonus') || 0;
        if (!this._parent) return b;
        return b + this._parent.bonus;
    }

    get succeed(): boolean {
        return this._bool('_succeed');
    }

    get fail(): boolean {
        return this._bool('_fail');
    }

    set(value: boolean | number) {
        if (value === false) {
            this._has = false;
            this._level = 0;
        } else {
            this._has = true;
            this._level = value === true ? 0 : value;
        }
    }

    _value(name: keyof this): number | boolean | undefined {
        if (this[name] !== undefined) {
            // @ts-ignore
            return this[name];
        }
        if (this._parent) {
            // @ts-ignore
            return this._parent._value(name);
        }
        return undefined;
    }

    _bool(name: keyof this): boolean {
        return !!this._value(name);
    }

    _int(name: keyof this): number {
        return this._value(name) as number;
    }

    adjust(adj: Partial<SkillInfo>) {
        Object.entries(adj).forEach(([key, value]) => {
            key = '_' + key;
            if (value === undefined) return;
            if (key === '_fixed') {
                if (typeof value !== 'number') {
                    throw new Error('fixed skill adjustment must be a number.');
                }
                value = Math.max(value, this._fixed || 0);
            } else if (key === '_bonus') {
                if (typeof value !== 'number') {
                    throw new Error('fixed skill adjustment must be a number.');
                }
                value = value + (this._bonus || 0);
            }
            // @ts-ignore
            this[key] = value;
        });
    }

    clear(adj: Partial<SkillInfo>) {
        Object.keys(adj).forEach((key) => {
            key = '_' + key;
            // @ts-ignore
            if (this[key] !== undefined) {
                // @ts-ignore
                this[key] = undefined;
            }
        });
    }
}

export class Skills {
    _skills: Record<string, Skill> = {};

    constructor(vals: Record<string, number | boolean> = {}) {
        Object.entries(vals).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    set(name: string, value: boolean | number): Skill {
        const s = this.get(name);
        s.set(value);
        return s;
    }

    get(name: string): Skill {
        let s = this._skills[name];
        if (s) return s;
        s = this._skills[name] = new Skill(name);
        const index = name.lastIndexOf('.');
        if (index > 0) {
            s._parent = this.get(name.substring(0, index));
        } else {
            s.set(false);
        }
        return s;
    }

    adjust(name: string, adj: Partial<SkillInfo> | number): Skill {
        if (typeof adj === 'number') {
            adj = { bonus: adj };
        }

        let s = this.get(name);
        s.adjust(adj);

        return s;
    }
}
