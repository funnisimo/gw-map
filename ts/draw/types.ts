import * as GWU from 'gw-utils';
import { Cell, Map } from '../map';

export type CellDrawFn = (
    dest: GWU.sprite.Mixer,
    map: Map,
    cell: Cell,
    fov?: GWU.fov.FovTracker
) => boolean;

export interface MapDrawOptions {
    offsetX: number;
    offsetY: number;
    fov?: GWU.fov.FovTracker | null;
}

export interface BufferSource {
    buffer: GWU.buffer.Buffer;
}

export interface CellDrawer {
    scent: boolean;

    drawCell: CellDrawFn;
    drawInto(
        dest: BufferSource | GWU.buffer.Buffer,
        map: Map,
        opts?: Partial<MapDrawOptions>
    ): void;
}
