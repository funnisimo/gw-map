import * as GWU from 'gw-utils';

import * as Tile from '../tile';
import { MapType } from '../map/types';
import * as Flags from '../flags';
import { SetTileOptions } from '../map/types';
import { MapLayer } from './mapLayer';

export class TileLayer extends MapLayer {
    constructor(map: MapType, name = 'tile') {
        super(map, name);
    }

    setTile(x: number, y: number, tile: Tile.Tile, opts: SetTileOptions = {}) {
        const cell = this.map.cell(x, y);

        const current = cell.depthTile(tile.depth) || Tile.tiles.NULL;

        if (!opts.superpriority) {
            // if (current !== tile) {
            //     this.gasVolume = 0;
            //     this.liquidVolume = 0;
            // }

            // Check priority, etc...
            if (current.priority > tile.priority) {
                return false;
            }
        }
        if (cell.blocksLayer(tile.depth)) return false;
        if (opts.blockedByItems && cell.hasItem()) return false;
        if (opts.blockedByActors && cell.hasActor()) return false;
        if (opts.blockedByOtherLayers && cell.highestPriority() > tile.priority)
            return false;

        // TODO - Are we blocked by other layer (L_BLOCKS_SURFACE on an already present tile)?

        if (tile.depth > Flags.Depth.GROUND && tile.groundTile) {
            const ground = cell.depthTile(Flags.Depth.GROUND);
            if (!ground || ground === Tile.tiles.NULL) {
                this.setTile(x, y, Tile.get(tile.groundTile));
            }
        }

        // if nothing changed... return false
        if (!cell.setTile(tile)) return false;

        if (tile.hasEntityFlag(Flags.Entity.L_BLOCKS_SURFACE)) {
            cell.clearDepth(Flags.Depth.SURFACE);
        }

        if (opts.machine) {
            cell.machineId = opts.machine;
        }

        if (current.light !== tile.light) {
            this.map.light.glowLightChanged = true;
        }

        if (tile.hasTileFlag(Flags.Tile.T_IS_FIRE)) {
            cell.setCellFlag(Flags.Cell.CAUGHT_FIRE_THIS_TURN);
        }

        // if (volume) {
        //     if (tile.depth === Depth.GAS) {
        //         this.gasVolume = volume;
        //     }
        //     if (tile.depth === Depth.LIQUID) {
        //         this.liquidVolume = volume;
        //     }
        // }

        return true;
    }

    clearTile(x: number, y: number) {
        const cell = this.map.cell(x, y);
        return cell.clearDepth(this.depth);
    }

    async tick(_dt: number): Promise<boolean> {
        // Run any tick effects

        // Bookkeeping for fire, pressure plates and key-activated tiles.
        for (let x = 0; x < this.map.width; ++x) {
            for (let y = 0; y < this.map.height; ++y) {
                const cell = this.map.cell(x, y);
                if (
                    !cell.hasCellFlag(
                        Flags.Cell.HAS_ANY_ACTOR | Flags.Cell.HAS_ITEM
                    ) &&
                    cell.hasCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED)
                ) {
                    cell.clearCellFlag(Flags.Cell.PRESSURE_PLATE_DEPRESSED);
                }
                if (cell.hasEffect('noKey') && !this.map.hasKey(x, y)) {
                    await cell.fire('noKey', this.map, x, y);
                }
            }
        }

        return true;
    }

    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number) {
        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile) {
            dest.drawSprite(tile.sprite);
        }
    }
}
