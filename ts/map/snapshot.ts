import * as GWU from 'gw-utils';
import { Map } from './map';

export class Snapshot {
    map: Map;
    version: number;

    constructor(map: Map) {
        this.map = new Map(map.width, map.height);
        this.version = 0;
    }
}

export class SnapshotManager {
    map: Map;
    version = 0;
    cellVersion: GWU.grid.NumGrid;
    layerVersion: number[] = [];
    lightVersion = 0;
    fovVersion = 0;
    free: Snapshot[] = [];

    constructor(map: Map) {
        this.map = map;
        this.cellVersion = GWU.grid.make(map.width, map.height);
        this.layerVersion = map.layers.map(() => 1);
    }

    takeNew(): Snapshot {
        ++this.version;
        const snap = this.free.length
            ? this.free.pop()!
            : new Snapshot(this.map);

        snap.map.flags.map = this.map.flags.map;
        this.cellVersion.update((v, x, y) => {
            const srcCell = this.map.cell(x, y);
            if (srcCell.changed) {
                v = this.version;
            }
            if (v !== snap.version) {
                const destCell = snap.map.cell(x, y);
                destCell.copy(srcCell);
            }
            return v;
        });

        // systems
        if (this.map.light.changed) {
            this.lightVersion = this.version;
            this.map.light.changed = false;
        }
        if (snap.version !== this.lightVersion) {
            snap.map.light.copy(this.map.light);
        }
        if (this.map.fov.changed) {
            this.fovVersion = this.version;
            this.map.fov.changed = false;
        }
        if (snap.version !== this.fovVersion) {
            snap.map.fov.copy(this.map.fov);
        }

        // layers
        this.map.layers.forEach((layer, index) => {
            const snapLayer = snap.map.layers[index];
            if (layer.changed) {
                this.layerVersion[index] = this.version;
            }
            if (this.layerVersion[index] !== snap.version) {
                snapLayer.copy(layer);
            }
        });

        snap.version = this.version;
        return snap;
    }

    revertMapTo(snap: Snapshot) {
        this.cellVersion.update((v, x, y) => {
            if (v < snap.version) return v;
            const destCell = this.map.cell(x, y);
            if (v > snap.version || destCell.changed) {
                const srcCell = snap.map.cell(x, y);
                destCell.copy(srcCell);
                return snap.version;
            }

            return v;
        });

        // systems
        if (snap.version < this.lightVersion || this.map.light.changed) {
            this.map.light.copy(snap.map.light);
            this.lightVersion = snap.version;
        }

        if (snap.version < this.fovVersion || this.map.fov.changed) {
            this.map.fov.copy(snap.map.fov);
            this.fovVersion = snap.version;
        }

        // layers
        this.layerVersion.forEach((v, index) => {
            if (v < snap.version) return;
            const destLayer = this.map.layers[index];
            if (v > snap.version || destLayer.changed) {
                const srcLayer = snap.map.layers[index];
                destLayer.copy(srcLayer);
                this.layerVersion[index] = snap.version;
            }
        });

        this.version = snap.version;
    }

    release(snap: Snapshot) {
        this.free.push(snap);
    }
}
