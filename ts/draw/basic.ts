import * as GWU from 'gw-utils';
import * as Flags from '../flags';
import { CellType, MapType } from '../map/types';
import { CellDrawer, MapDrawOptions, BufferSource } from './types';

export class BasicDrawer implements CellDrawer {
    isAnyKindOfVisible(_cell: CellType): boolean {
        return true;
    }

    drawInto(
        dest: BufferSource | GWU.buffer.Buffer,
        map: MapType,
        opts: Partial<MapDrawOptions> = {}
    ) {
        const buffer = dest instanceof GWU.buffer.Buffer ? dest : dest.buffer;

        const offsetX = opts.offsetX || 0;
        const offsetY = opts.offsetY || 0;

        const mixer = new GWU.sprite.Mixer();
        for (let x = 0; x < buffer.width; ++x) {
            for (let y = 0; y < buffer.height; ++y) {
                if (map.hasXY(x + offsetX, y + offsetY)) {
                    const cell = map.cell(x + offsetX, y + offsetY);
                    this.drawCell(mixer, cell, opts.fov);
                    buffer.drawSprite(x, y, mixer);
                }
            }
        }
    }

    drawCell(
        dest: GWU.sprite.Mixer,
        cell: CellType,
        fov?: GWU.fov.FovTracker
    ): boolean {
        dest.blackOut();

        // const isVisible = fov ? fov.isAnyKindOfVisible(cell.x, cell.y) : true;
        const needSnapshot = !cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        if (cell.needsRedraw || needSnapshot) {
            this.getAppearance(dest, cell);
            cell.putSnapshot(dest);
            cell.needsRedraw = false;
            cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        } else {
            cell.getSnapshot(dest);
        }

        this.applyLight(dest, cell, fov);

        if (
            cell.hasEntityFlag(
                Flags.Entity.L_VISUALLY_DISTINCT |
                    Flags.Entity.L_LIST_IN_SIDEBAR,
                true
            )
        ) {
            GWU.color.separate(dest.fg, dest.bg);
        }
        return true;
    }

    // getCellAppearance(cell: CellType, dest: GWU.sprite.Mixer) {
    //     dest.blackOut();
    //     const isVisible = true; // this.fov.isAnyKindOfVisible(x, y);
    //     const isRevealed = true; // this.fov.isRevealed(x, y);

    //     const needSnapshot = !cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT);
    //     if (needSnapshot || (cell.needsRedraw && isVisible)) {
    //         this.layers.forEach((layer) => layer.putAppearance(dest, cell));

    //         if (dest.dances) {
    //             cell.setCellFlag(Flags.Cell.COLORS_DANCE);
    //         } else {
    //             cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
    //         }

    //         dest.bake();
    //         cell.putSnapshot(dest);
    //         cell.needsRedraw = false;
    //         cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);
    //     } else {
    //         cell.getSnapshot(dest);
    //     }

    //     if (isVisible) {
    //         const light = this.light.getLight(cell.x, cell.y);
    //         dest.multiply(light);
    //     } else if (isRevealed) {
    //         dest.scale(50);
    //     } else {
    //         dest.blackOut();
    //     }

    //     if (cell.hasEntityFlag(Flags.Entity.L_VISUALLY_DISTINCT)) {
    //         GWU.color.separate(dest.fg, dest.bg);
    //     }
    // }

    getAppearance(dest: GWU.sprite.Mixer, cell: CellType) {
        const ground = cell.tiles[Flags.Depth.GROUND];
        const surface = cell.tiles[Flags.Depth.SURFACE];
        const liquid = cell.tiles[Flags.Depth.LIQUID];
        const gas = cell.tiles[Flags.Depth.GAS]; // How to get volume!?!?!?!
        const actor = cell.hasActor() ? cell.map.actorAt(cell.x, cell.y) : null;
        const item = cell.hasItem() ? cell.map.itemAt(cell.x, cell.y) : null;

        dest.drawSprite(ground.sprite);
        if (surface) {
            dest.drawSprite(surface.sprite);
        }
        if (liquid) {
            dest.drawSprite(liquid.sprite);
        }
        if (item) {
            item.drawInto(dest);
        }
        if (actor) {
            actor.drawInto(dest);
        }
        if (gas) {
            const opacity = GWU.rng.cosmetic.number(50) + 25;
            dest.drawSprite(gas.sprite, opacity);
        }

        if (dest.dances) {
            cell.setCellFlag(Flags.Cell.COLORS_DANCE);
        } else {
            cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
        }

        dest.bake();
    }

    applyLight(
        dest: GWU.sprite.Mixer,
        cell: CellType,
        fov?: GWU.fov.FovTracker
    ) {
        const isVisible = !fov || fov.isAnyKindOfVisible(cell.x, cell.y);
        const isRevealed = !fov || fov.isRevealed(cell.x, cell.y);
        const light = cell.map.light.getLight(cell.x, cell.y);
        dest.multiply(light);
        // TODO - is Clairy
        // TODO - is Telepathy

        if (fov && fov.isCursor(cell.x, cell.y)) {
            dest.invert();
        } else if (!isVisible) {
            if (isRevealed) {
                dest.scale(50);
            } else {
                dest.blackOut();
            }
        }
    }
}
