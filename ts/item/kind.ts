import * as GWU from 'gw-utils';
import * as Entity from '../entity';
import * as Flags from '../flags';

import { Item } from './item';
import { FlagType } from './types';
import { Cell } from '../map';
import * as ACTION from '../action';

export interface KindOptions extends Entity.KindOptions {
    flags?: GWU.flag.FlagBase;
    actions?: Record<string, boolean | ACTION.ActionFn>;
    bump?: string | ACTION.ActionFn | (string | ACTION.ActionFn)[];
}
export interface MakeOptions extends Entity.MakeOptions {
    quantity: number;
}

export class ItemKind extends Entity.EntityKind {
    flags: FlagType = {
        item: Flags.Item.DEFAULT,
        entity: Flags.Entity.DEFAULT_ACTOR,
    };
    bump: (string | ACTION.ActionFn)[] = [];

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
        if (config.bump) {
            if (
                typeof config.bump === 'string' ||
                typeof config.bump === 'function'
            ) {
                config.bump = [config.bump];
            }
            if (Array.isArray(config.bump)) {
                this.bump = config.bump.slice();
            }
        }
        this.avoidTileFlags |= Flags.Tile.T_DEEP_WATER;
        this.forbidTileFlags |= Flags.Tile.T_LAVA | Flags.Tile.T_AUTO_DESCENT;

        this.sidebarFg = GWU.color.from(
            config.sidebarFg || Item.default.sidebarFg
        );
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

    avoidsCell(cell: Cell, item: Item): boolean {
        if (cell.isDoor() || cell.isStairs()) return true;
        return super.avoidsCell(cell, item);
    }

    // forbidsCell(_cell: CellType, _item: Item,): boolean {
    //     return false;
    // }
}
