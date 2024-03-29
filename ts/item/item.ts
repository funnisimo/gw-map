import { Entity } from '../entity';
import { FlagType } from './types';
import { Depth } from '../flags';

import * as Kind from './kind';

export class Item extends Entity {
    // @ts-ignore - initialized in constructor
    flags: FlagType;
    quantity = 1;
    kind: Kind.ItemKind;
    next: Item | null = null;

    constructor(kind: Kind.ItemKind) {
        super(kind);
        // @ts-ignore - initialized in constructor
        this.flags.item = 0;
        this.depth = Depth.ITEM;
        this.kind = kind;
    }

    copy(other: Item) {
        super.copy(other);
        this.quantity = other.quantity;
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
