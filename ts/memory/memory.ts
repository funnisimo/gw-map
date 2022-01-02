// import * as GWU from 'gw-utils';
// import { Actor } from '../actor/actor';
// import { Item } from '../item/item';
// import { MapType, CellType } from '../map/types';
// import { Cell } from '../map/cell';
// import { Map } from '../map/map';
// import * as Flags from '../flags';

// export interface ActorInfo {
//     actor: Actor;
//     readonly x: number;
//     readonly y: number;
// }

// export interface ItemInfo {
//     item: Item;
//     readonly x: number;
//     readonly y: number;
// }

// export class Memory extends Map {
//     // actor: Actor;
//     source: MapType;

//     constructor(map: MapType) {
//         super(map.width, map.height);
//         // this.actor = actor;
//         this.source = map;
//         this.cells.forEach((c) => c.setCellFlag(Flags.Cell.STABLE_MEMORY));
//     }

//     cell(x: number, y: number): CellType {
//         let cell: CellType = this.cells[x][y];
//         if (!cell.hasCellFlag(Flags.Cell.STABLE_MEMORY)) {
//             cell = this.source.cell(x, y);
//         }
//         return cell;
//     }

//     memory(x: number, y: number): Cell {
//         return this.cells[x][y];
//     }

//     isMemory(x: number, y: number): boolean {
//         return this.cells[x][y].hasCellFlag(Flags.Cell.STABLE_MEMORY);
//     }

//     setTile(): boolean {
//         throw new Error('Cannot set tiles on memory.');
//     }

//     // addItem(x: number, y: number, item: Item, fireEffects: boolean): boolean;
//     // addItem(x: number, y: number, item: Item): boolean;
//     addItem(): boolean {
//         throw new Error('Cannot add Items to memory!');
//     }

//     // removeItem(item: Item, fireEffects: boolean): boolean;
//     // removeItem(item: Item): boolean;
//     removeItem(): boolean {
//         throw new Error('Cannot remove Items from memory!');
//     }

//     itemAt(x: number, y: number): Item | null {
//         // if (this.isMemory(x, y)) return null;
//         return this.source.itemAt(x, y);
//     }

//     eachItem(cb: GWU.types.EachCb<Item>): void {
//         this.source.eachItem((i) => {
//             if (this.isMemory(i.x, i.y)) return;
//             cb(i);
//         });
//     }

//     // addActor(x: number, y: number, actor: Actor, fireEffects: boolean): boolean;
//     // addActor(x: number, y: number, actor: Actor): boolean;
//     addActor(): boolean {
//         throw new Error('Cannot add Actors to memory!');
//     }

//     // removeActor(actor: Actor, fireEffects: boolean): boolean;
//     // removeActor(actor: Actor): boolean;
//     removeActor(): boolean {
//         throw new Error('Cannot remove Actors from memory!');
//     }

//     actorAt(x: number, y: number): Actor | null {
//         if (this.isMemory(x, y)) return null;
//         return this.source.actorAt(x, y);
//     }

//     eachActor(cb: GWU.types.EachCb<Actor>): void {
//         this.source.eachActor((a) => {
//             if (this.isMemory(a.x, a.y)) return;
//             cb(a);
//         });
//     }

//     storeMemory(x: number, y: number) {
//         const mem = this.cells[x][y];

//         const currentList = mem.hasEntityFlag(
//             Flags.Entity.L_LIST_IN_SIDEBAR,
//             true
//         );

//         // cleanup any old items+actors
//         const cell = this.source._cell(x, y);
//         mem.copy(cell);
//         mem.setCellFlag(Flags.Cell.STABLE_MEMORY);
//         mem.clearCellFlag(Flags.Cell.STABLE_SNAPSHOT);
//         mem.map = this; // so that drawing this cell results in using the right map

//         let newList = mem.hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR);

//         // add any current items+actors
//         // if (cell.hasItem()) {
//         //     mem.clearCellFlag(Flags.Cell.HAS_ITEM);
//         // }
//         if (cell.hasActor()) {
//             mem.clearCellFlag(Flags.Cell.HAS_ANY_ACTOR);
//         }

//         if (currentList != newList) {
//             this.setMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
//         }

//         this.light.setLight(x, y, this.source.light.getLight(x, y));
//     }

//     makeVisible(x: number, y: number) {
//         const mem = this.memory(x, y);
//         const currentList = mem.hasEntityFlag(
//             Flags.Entity.L_LIST_IN_SIDEBAR,
//             true
//         );

//         // cleanup any old items+actors

//         mem.clearCellFlag(
//             Flags.Cell.STABLE_MEMORY | Flags.Cell.STABLE_SNAPSHOT
//         );

//         let newList = this.source
//             .cell(x, y)
//             .hasEntityFlag(Flags.Entity.L_LIST_IN_SIDEBAR, true);

//         if (currentList != newList) {
//             this.setMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
//         }
//     }

//     onFovChange(x: number, y: number, isVisible: boolean) {
//         if (!isVisible) {
//             this.storeMemory(x, y);
//         } else {
//             this.makeVisible(x, y);
//         }
//     }
// }
