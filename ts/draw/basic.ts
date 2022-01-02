import * as GWU from 'gw-utils';
import * as Flags from '../flags';
import { Cell } from '../map/cell';
import { Map } from '../map/map';
import { CellDrawer, MapDrawOptions, BufferSource } from './types';
import { Actor } from '../actor/actor';
import { Item } from '../item/item';

const highlightColor = GWU.color.install('highlight', [100, 100, 0]);

export class BasicDrawer implements CellDrawer {
    scent = false;

    constructor() {}

    drawInto(
        dest: BufferSource | GWU.buffer.Buffer,
        map: Map,
        opts: Partial<MapDrawOptions> = {}
    ) {
        const buffer = dest instanceof GWU.buffer.Buffer ? dest : dest.buffer;

        const offsetX = opts.offsetX || 0;
        const offsetY = opts.offsetY || 0;

        map.clearMapFlag(Flags.Map.MAP_DANCES);

        const mixer = new GWU.sprite.Mixer();
        for (let x = 0; x < buffer.width; ++x) {
            for (let y = 0; y < buffer.height; ++y) {
                if (map.hasXY(x + offsetX, y + offsetY)) {
                    const cell = map._cell(x + offsetX, y + offsetY);
                    this.drawCell(mixer, map, cell, map.fov);
                    buffer.drawSprite(x, y, mixer);
                }
            }
        }
    }

    drawCell(
        dest: GWU.sprite.Mixer,
        map: Map,
        cell: Cell,
        fov?: GWU.fov.FovTracker | null
    ): boolean {
        dest.blackOut();

        // const isVisible = fov ? fov.isAnyKindOfVisible(cell.x, cell.y) : true;
        const needSnapshot = !cell.hasCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        if (cell.needsRedraw || needSnapshot) {
            this.getAppearance(dest, map, cell);
            cell.putSnapshot(dest);
            cell.needsRedraw = false;
            cell.setCellFlag(Flags.Cell.STABLE_SNAPSHOT);
        } else {
            cell.getSnapshot(dest);
            if (cell.hasCellFlag(Flags.Cell.COLORS_DANCE)) {
                map.setMapFlag(Flags.Map.MAP_DANCES);
            }
        }

        this.applyLight(dest, cell, fov);

        let separate = false;

        if (cell.memory) {
            separate = !!(
                cell.memory.flags.entity &
                (Flags.Entity.L_VISUALLY_DISTINCT |
                    Flags.Entity.L_LIST_IN_SIDEBAR)
            );
        } else {
            separate = cell.hasEntityFlag(
                Flags.Entity.L_VISUALLY_DISTINCT |
                    Flags.Entity.L_LIST_IN_SIDEBAR,
                true
            );
        }

        if (cell.hasCellFlag(Flags.Cell.IS_CURSOR)) {
            dest.bg = dest.bg.mix(highlightColor, 50);
            separate = true;
        } else if (cell.hasCellFlag(Flags.Cell.IS_HIGHLIGHTED)) {
            dest.bg = dest.bg.mix(highlightColor, 25);
            separate = true;
            dest.invert();
        }

        if (this.scent && map.player) {
            const s = GWU.clamp(
                map.player.scent.get(cell.x, cell.y) * 5,
                0,
                50
            );
            if (s) {
                const c = GWU.color.colors.red;
                dest.mix(c, 0, s);
            }
        }

        if (separate) {
            [dest.fg, dest.bg] = GWU.color.separate(dest.fg, dest.bg);
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
    //         [dest.fg, dest.bg] = GWU.color.separate(dest.fg, dest.bg);
    //     }
    // }

    getAppearance(dest: GWU.sprite.Mixer, map: Map, cell: Cell) {
        let tiles = cell.tiles;
        let actor: Actor | null = null;
        let item: Item | null = null;

        if (cell.memory) {
            tiles = cell.memory.tiles;
            item = cell.memory.item;
        } else {
            actor = cell.hasActor() ? cell.actor : null;
            item = cell.hasItem() ? cell.item : null;
        }

        const ground = tiles[Flags.Depth.GROUND];
        const surface = tiles[Flags.Depth.SURFACE];
        const liquid = tiles[Flags.Depth.LIQUID];
        const gas = tiles[Flags.Depth.GAS]; // How to get volume!?!?!?!

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
        if (cell.hasFx()) {
            const fx = map.fxAt(cell.x, cell.y);
            if (fx) dest.drawSprite(fx.sprite);
        }

        if (dest.dances) {
            cell.setCellFlag(Flags.Cell.COLORS_DANCE);
            map.setMapFlag(Flags.Map.MAP_DANCES);
        } else {
            cell.clearCellFlag(Flags.Cell.COLORS_DANCE);
        }

        dest.bake(true); // apply dancing
    }

    applyLight(
        dest: GWU.sprite.Mixer,
        cell: Cell,
        fov?: GWU.fov.FovTracker | null
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
                dest.scale(70);
            } else {
                dest.blackOut();
            }
        }
    }
}
