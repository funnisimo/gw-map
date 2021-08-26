import { Entity } from '../entity';
import { FlagType } from './types';
import { Depth } from '../flags';

import * as Kind from './kind';

export class Item extends Entity {
    flags: FlagType;
    quantity = 1;
    kind: Kind.ItemKind;
    next: Item | null = null;

    constructor(kind: Kind.ItemKind) {
        super(kind);
        // @ts-ignore
        this.flags = this.flags || {};
        this.flags.item = 0;
        this.depth = Depth.ITEM;
        this.kind = kind;
    }

    itemFlags(): number {
        return this.flags.item;
    }
    hasItemFlag(flag: number) {
        return !!(this.flags.item & flag);
    }
    hasAllItemFlags(flags: number) {
        return (this.flags.item & flags) === flags;
    }
}

export function make(id: string | Kind.ItemKind): Item {
    const kind = Kind.get(id);
    if (!kind) throw new Error('Failed to find item kind - ' + id);
    return new Item(kind);
}

export function makeRandom(opts: Partial<Kind.MatchOptions> | string): Item {
    const kind = Kind.randomKind(opts);
    if (!kind)
        throw new Error(
            'Failed to find item kind matching - ' + JSON.stringify(opts)
        );
    return new Item(kind);
}

export function from(info: string | Kind.ItemKind | Kind.KindOptions): Item {
    let kind: Kind.ItemKind;
    if (typeof info === 'string') {
        // @ts-ignore
        kind = Kind.get(info);
        if (!kind) throw new Error('Failed to find item kind - ' + info);
    } else if (info instanceof Kind.ItemKind) {
        kind = info;
    } else {
        kind = Kind.makeKind(info);
    }
    return new Item(kind);
}
