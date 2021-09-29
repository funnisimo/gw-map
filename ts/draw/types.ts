import * as GWU from 'gw-utils';
import { CellType, MapType } from '../map/types';

export type CellDrawFn = (
    dest: GWU.sprite.Mixer,
    cell: CellType,
    fov?: GWU.fov.FovTracker
) => boolean;

export interface MapDrawOptions {
    offsetX: number;
    offsetY: number;
    fov?: GWU.fov.FovTracker;
}

export interface BufferSource {
    buffer: GWU.canvas.DataBuffer;
}

export interface CellDrawer {
    drawCell: CellDrawFn;
    drawInto(
        dest: BufferSource | GWU.canvas.DataBuffer,
        map: MapType,
        opts?: Partial<MapDrawOptions>
    ): void;
}
