import { Entity } from '../entity/entity';
import { FlagType } from './types';
import { Depth } from '../flags';

import * as Action from './action';
import * as Kind from './kind';

export class Item extends Entity {
    static default = {
        sidebarFg: 'gold',
    };

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

    isPlural(): boolean {
        if (this.quantity > 1) return true;
        return super.isPlural();
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

    getAction(name: string): Action.ItemActionBase | undefined {
        const action = this.kind.actions[name];
        return action;
    }

    getBumpActions(): (Action.ItemActionFn | string)[] {
        return this.kind.bump;
    }
}
