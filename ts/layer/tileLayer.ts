import { Map } from '../map/map';
import { SetTileOptions } from '../map/cell';
import { MapLayer } from './mapLayer';
import * as Tile from '../tile';

export class TileLayer extends MapLayer {
    constructor(map: Map, name = 'tile') {
        super(map, name);
    }

    setTile(
        x: number,
        y: number,
        tile: Tile.Tile,
        opts?: SetTileOptions
    ): boolean {
        const cell = this.map.cell(x, y);
        return cell.setTile(tile, opts);
    }

    clearTile(x: number, y: number): boolean {
        const cell = this.map.cell(x, y);
        return cell.clearDepth(this.depth);
    }

    tick(_dt: number): boolean {
        // Run any tick effects

        // // Bookkeeping for fire, pressure plates and key-activated tiles.
        // for (let x = 0; x < this.map.width; ++x) {
        //     for (let y = 0; y < this.map.height; ++y) {
        //         const cell = this.map.cell(x, y);
        //         if (
        //             !cell.hasCellFlag(
        //                 Flags.Cell.HAS_ANY_ACTOR | Flags.Cell.HAS_ITEM
        //             ) &&
        //             cell.hasCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED)
        //         ) {
        //             cell.clearCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED);
        //         }
        //     }
        // }

        return true;
    }
}
