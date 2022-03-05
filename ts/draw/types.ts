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

export interface DrawDest {
    readonly width: number;
    readonly height: number;
    draw(
        x: number,
        y: number,
        ch: string,
        fg: GWU.color.ColorBase,
        bg: GWU.color.ColorBase
    ): void;
}

export interface CellDrawer {
    scent: boolean;

    drawCell: CellDrawFn;
    drawInto(dest: DrawDest, map: Map, opts?: Partial<MapDrawOptions>): void;
}
