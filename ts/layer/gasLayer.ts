import * as GWU from 'gw-utils';

import * as Flags from '../flags';
import { TileLayer } from './tileLayer';
import { MapType, SetTileOptions } from '../map/types';
import * as Tile from '../tile';

export class GasLayer extends TileLayer {
    volume: GWU.grid.NumGrid;

    constructor(map: MapType, name = 'gas') {
        super(map, name);
        this.volume = GWU.grid.alloc(map.width, map.height, 0);
    }

    clear() {
        this.volume.fill(0);
    }

    setTile(x: number, y: number, tile: Tile.Tile, opts: SetTileOptions = {}) {
        if (!opts.volume) return false;
        const cell = this.map.cell(x, y);
        if (cell.depthTile(tile.depth) === tile) {
            this.volume[x][y] += opts.volume;
            return true;
        }

        if (!super.setTile(x, y, tile, opts)) {
            return false;
        }

        this.volume[x][y] = opts.volume;
        this.changed = true;
        return true;
    }

    clearTile(x: number, y: number) {
        const cell = this.map.cell(x, y);
        if (cell.clearDepth(this.depth)) {
            this.volume[x][y] = 0;
            return true;
        }
        return false;
    }

    copy(other: GasLayer) {
        this.volume.copy(other.volume);
        this.changed = other.changed;
    }

    async tick(_dt: number): Promise<boolean> {
        if (!this.changed) return false;
        this.changed = false;

        const startingVolume = this.volume;
        this.volume = GWU.grid.alloc(this.map.width, this.map.height);

        // dissipate the gas...
        this.dissipate(startingVolume);

        // spread the gas...
        this.spread(startingVolume);

        GWU.grid.free(startingVolume);
        return true;
    }

    dissipate(volume: GWU.grid.NumGrid) {
        volume.update((v, x, y) => {
            if (!v) return 0;
            const tile = this.map.cell(x, y).depthTile(this.depth);
            if (tile && tile.dissipate) {
                let d = Math.max(0.5, (v * tile.dissipate) / 10000); // 1000 = 10%
                v = Math.max(0, v - d);
            }
            if (v) {
                this.changed = true;
            } else {
                this.clearTile(x, y);
            }

            return v;
        });
    }

    calcOpacity(volume: number): number {
        return Math.floor(Math.min(volume, 10) * 10);
    }

    updateCellVolume(x: number, y: number, startingVolume: GWU.grid.NumGrid) {
        let total = 0;
        let count = 0;

        let highestVolume = 0;
        const cell = this.map.cell(x, y);
        let startingTile = cell.depthTile(this.depth);
        let highestTile = startingTile;

        if (cell.hasEntityFlag(Flags.Entity.L_BLOCKS_GAS)) {
            this.volume[x][y] = 0;
            if (startingVolume[x][y]) {
                this.clearTile(x, y);
            }
            return;
        }

        for (
            let i = Math.max(0, x - 1);
            i < Math.min(x + 2, startingVolume.width);
            ++i
        ) {
            for (
                let j = Math.max(0, y - 1);
                j < Math.min(y + 2, startingVolume.height);
                ++j
            ) {
                const v = startingVolume[i][j];
                if (!cell.hasEntityFlag(Flags.Entity.L_BLOCKS_GAS)) {
                    ++count;
                    if (v > highestVolume) {
                        highestVolume = v;
                        highestTile = this.map.cell(i, j).depthTile(this.depth);
                    }
                }
                total += v;
            }
        }

        const v = Math.floor((total * 10) / count) / 10;
        this.volume[x][y] = v;

        if (v > 0 && highestTile) {
            if (!startingTile || startingTile !== highestTile) {
                cell.setTile(highestTile);
            }
        }
        if (v > 0) {
            cell.needsRedraw = true;
        }
    }

    spread(startingVolume: GWU.grid.NumGrid) {
        for (let x = 0; x < startingVolume.width; ++x) {
            for (let y = 0; y < startingVolume.height; ++y) {
                this.updateCellVolume(x, y, startingVolume);
            }
        }
    }

    putAppearance(dest: GWU.sprite.Mixer, x: number, y: number) {
        const volume = this.volume[x][y];
        if (!volume) return;

        const cell = this.map.cell(x, y);
        const tile = cell.depthTile(this.depth);
        if (tile) {
            const opacity = this.calcOpacity(volume);
            dest.drawSprite(tile.sprite, opacity);
        }
    }
}
