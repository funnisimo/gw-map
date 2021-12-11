import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import * as Flags from '../flags';

import { Actor } from '../actor/actor';
import { Item } from './item';
import { FlagType } from './types';
import { Game } from '../game';

export type ItemActionFn = (
    this: Game,
    actor: Actor,
    opts: { item: Item }
) => Promise<boolean>;
export type ItemActionBase = boolean | ItemActionFn;

export interface KindOptions extends Entity.KindOptions {
    flags?: GWU.flag.FlagBase;
    actions?: Record<string, ItemActionBase>;
}
export interface MakeOptions extends Entity.MakeOptions {
    quantity: number;
}

export class ItemKind extends Entity.EntityKind {
    flags: FlagType = {
        item: Flags.Item.DEFAULT,
        entity: Flags.Entity.DEFAULT_ACTOR,
    };
    actions: Record<string, ItemActionBase> = {};

    constructor(config: KindOptions) {
        super(config);
        if (config.flags) {
            this.flags.item = GWU.flag.from(
                Flags.Item,
                this.flags.item,
                config.flags
            );
            this.flags.entity = GWU.flag.from(
                Flags.Entity,
                this.flags.entity,
                config.flags
            );
        }
        if (config.actions) {
            Object.entries(config.actions).forEach(([key, value]) => {
                this.actions[key] = value;
            });
        }
    }

    make(options?: Partial<MakeOptions>): Item {
        const item = new Item(this);
        this.init(item, options);
        return item;
    }

    init(item: Item, options: Partial<MakeOptions> = {}) {
        super.init(item, options);
        Object.assign(item.flags, this.flags);
        item.quantity = options.quantity || 1;
    }

    // forbidsCell(_cell: CellType, _item: Item,): boolean {
    //     return false;
    // }
}
