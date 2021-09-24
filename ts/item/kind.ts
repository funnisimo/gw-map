// import * as GWU from 'gw-utils';
import * as Entity from '../entity';

import { Item } from './item';

export interface KindOptions extends Entity.KindOptions {}
export interface MakeOptions extends Entity.MakeOptions {
    quantity: number;
}

export class ItemKind extends Entity.EntityKind {
    constructor(config: KindOptions) {
        super(config);
    }

    make(options?: Partial<MakeOptions>): Item {
        const item = new Item(this);
        this.init(item, options);
        return item;
    }

    init(item: Item, options: Partial<MakeOptions> = {}) {
        super.init(item, options);
        item.quantity = options.quantity || 1;
    }

    // forbidsCell(_cell: CellType, _item: Item,): boolean {
    //     return false;
    // }
}
