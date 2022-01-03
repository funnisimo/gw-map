import * as GWU from 'gw-utils';
import { Player } from './player';

export class Scent {
    _player: Player;
    _data!: GWU.grid.NumGrid;

    constructor(player: Player) {
        this._player = player;
    }

    get(x: number, y: number): number {
        if (!this._data) return 0;
        return this._data[x][y];
    }

    clear() {
        if (!this._player.map) return;
        if (this._data) GWU.grid.free(this._data);
        this._data = GWU.grid.alloc(
            this._player.map.width,
            this._player.map.height
        );
    }

    update() {
        if (!this._player.map) return;

        const scent = this._player.data.scent || 10;
        this._data[this._player.x][this._player.y] = scent;

        const updated = GWU.grid.alloc(this._data.width, this._data.height);
        const map = this._player.map!;

        this._data.forEach((v, x, y) => {
            const cell = map.cell(x, y);
            if (cell.blocksMove()) return;
            let highest = v;
            GWU.xy.eachNeighbor(
                x,
                y,
                (x1, y1) => {
                    if (!this._data.hasXY(x1, y1)) return;
                    const v1 = this._data[x1][y1];
                    if (v1 > highest) {
                        highest = v1;
                    }
                },
                true
            );

            const delta = cell.hasLiquid() ? 3 : 1;
            updated[x][y] = Math.max(0, highest - delta);
        });

        GWU.grid.free(this._data);
        this._data = updated;
    }

    nextDir(x: number, y: number): GWU.xy.Loc | null {
        const v = this._data[x][y] || 0;
        if (!v) return null;
        let highest = v;
        let highestLoc: GWU.xy.Loc[] = [];

        GWU.xy.eachNeighbor(
            x,
            y,
            (x1, y1) => {
                if (!this._data.hasXY(x1, y1)) return;
                const v1 = this._data[x1][y1];
                if (v1 == highest) {
                    highestLoc.push([x1, y1]);
                } else if (v1 > highest) {
                    highestLoc = [[x1, y1]];
                    highest = v1;
                }
            },
            false
        );

        if (!highestLoc.length) return null;

        const loc = GWU.random.item(highestLoc);

        loc[0] = loc[0] - x;
        loc[1] = loc[1] - y;
        return loc;
    }
}
