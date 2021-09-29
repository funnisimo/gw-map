import { MapType, SetTileOptions } from '../map/types';
import * as Tile from '../tile';
import * as Actor from '../actor';
import * as Item from '../item';

export class MapLayer {
    map: MapType;
    depth: number;
    properties: Record<string, any>;
    name: string;
    changed: boolean = false;

    constructor(map: MapType, name = 'layer') {
        this.map = map;
        this.depth = -1;
        this.properties = {};
        this.name = name;
    }

    copy(_other: MapLayer) {}
    clear() {}

    setTile(
        _x: number,
        _y: number,
        _tile: Tile.Tile,
        _opts?: SetTileOptions
    ): boolean {
        return false;
    }
    clearTile(_x: number, _y: number): boolean {
        return false;
    }

    addActor(
        _x: number,
        _y: number,
        _actor: Actor.Actor
    ): Promise<boolean> | boolean {
        return false;
    }
    forceActor(_x: number, _y: number, _actor: Actor.Actor): boolean {
        return false;
    }
    removeActor(_actor: Actor.Actor): Promise<boolean> | boolean {
        return false;
    }

    addItem(
        _x: number,
        _y: number,
        _item: Item.Item
    ): Promise<boolean> | boolean {
        return false;
    }
    forceItem(_x: number, _y: number, _item: Item.Item): boolean {
        return false;
    }

    removeItem(_item: Item.Item): Promise<boolean> | boolean {
        return false;
    }

    // Time based changes to the layer (e.g. dissipate gasses)
    tick(_dt: number): Promise<boolean> | boolean {
        return false;
    }
}
