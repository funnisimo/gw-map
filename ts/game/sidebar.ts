import * as GWU from 'gw-utils';
import { Actor } from '../actor/actor';
import { Item } from '../item/item';
import { Cell } from '../map/cell';
import { Map } from '../map/map';
import * as Flags from '../flags';

import { UISubject } from './viewport';

GWU.color.install('blueBar', 15, 10, 50);
GWU.color.install('redBar', 45, 10, 15);
GWU.color.install('purpleBar', 50, 0, 50);
GWU.color.install('greenBar', 10, 50, 10);

export interface SidebarOptions {
    bg?: GWU.color.ColorBase;
    width?: number;
}

export interface SidebarInit extends SidebarOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export abstract class EntryBase {
    dist = 0;
    priority = 0;
    changed = false;
    sidebarY = -1;

    abstract get x(): number;
    abstract get y(): number;

    draw(_buffer: GWU.buffer.Buffer, _bounds: GWU.xy.Bounds): number {
        return 0;
    }
}

export class ActorEntry extends EntryBase {
    actor: Actor;

    constructor(actor: Actor) {
        super();
        this.actor = actor;
    }

    get x() {
        return this.actor.x;
    }
    get y() {
        return this.actor.y;
    }

    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        return this.actor.drawStatus(buffer, bounds);
    }
}

export class ItemEntry extends EntryBase {
    item: Item;

    constructor(item: Item) {
        super();
        this.item = item;
    }

    get x() {
        return this.item.x;
    }
    get y() {
        return this.item.y;
    }

    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        return this.item.drawStatus(buffer, bounds);
    }
}

export class CellEntry extends EntryBase {
    cell: Cell;

    constructor(cell: Cell) {
        super();
        this.cell = cell;
    }

    get x() {
        return this.cell.x;
    }
    get y() {
        return this.cell.y;
    }

    draw(buffer: GWU.buffer.Buffer, bounds: GWU.xy.Bounds): number {
        return this.cell.drawStatus(buffer, bounds);
    }
}

export type SidebarEntry = ActorEntry | ItemEntry | CellEntry;

export class Sidebar {
    bounds: GWU.xy.Bounds;

    cellCache: Cell[] = [];
    lastX = -1;
    lastY = -1;
    lastMap: Map | null = null;
    entries: SidebarEntry[] = [];
    subject: UISubject | null = null;
    highlight: EntryBase | null = null;

    bg: GWU.color.Color;
    needsDraw = true;

    constructor(opts: SidebarInit) {
        this.bounds = new GWU.xy.Bounds(
            opts.x,
            opts.y,
            opts.width,
            opts.height
        );
        this.bg = GWU.color.from(opts.bg || 'darkest_gray');
    }

    contains(xy: GWU.xy.XY | GWU.xy.Loc): boolean {
        return this.bounds.contains(xy);
    }

    reset() {
        this.lastMap = null;
        this.lastX = -1;
        this.lastY = -1;
        this.needsDraw = true;
    }

    entryAt(e: GWU.io.Event): EntryBase | null {
        return (
            this.entries.find((entry) => {
                return entry.sidebarY <= e.y && entry.sidebarY !== -1;
            }) || null
        );
    }

    mousemove(e: GWU.io.Event): boolean {
        if (this.contains(e)) {
            this._highlightRow(e.y);
            return true;
        }
        this.clearHighlight();
        return false;
    }

    highlightAt(x: number, y: number) {
        const last = this.highlight;
        this.highlight = null;
        // processed in ascending y order
        this.entries.forEach((e) => {
            if (e.x == x && e.y == y) {
                this.highlight = e;
            }
        });

        const changed = this.highlight !== last;
        this.needsDraw ||= changed;
        return changed;
    }

    _highlightRow(y: number) {
        const last = this.highlight;
        this.highlight = null;
        // processed in ascending y order
        this.entries.forEach((e) => {
            if (e.sidebarY <= y && e.sidebarY !== -1) {
                this.highlight = e;
            }
        });

        const changed = this.highlight !== last;
        this.needsDraw ||= changed;

        if (this.highlight && this.lastMap) {
            // @ts-ignore
            this.lastMap.showCursor(this.highlight.x, this.highlight.y);
        }

        return changed;
    }

    clearHighlight() {
        const result = !!this.highlight;
        this.highlight = null;
        this.needsDraw ||= result;
        return result;
    }

    _updateCellCache(map: Map): boolean {
        if (
            this.lastMap &&
            map === this.lastMap &&
            !map.hasMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED)
        ) {
            return false;
        }

        this.lastMap = null; // Force us to regather the entries, even if at same location

        this.cellCache.length = 0;
        GWU.xy.forRect(map.width, map.height, (x, y) => {
            const info = map.cell(x, y);
            if (info.hasTileFlag(Flags.Tile.T_LIST_IN_SIDEBAR)) {
                this.cellCache.push(info);
            }
        });

        map.clearMapFlag(Flags.Map.MAP_SIDEBAR_TILES_CHANGED);
        this.needsDraw = true;
        return true;
    }

    _makeActorEntry(actor: Actor): ActorEntry {
        return new ActorEntry(actor);
    }

    _makeItemEntry(item: Item): ItemEntry {
        return new ItemEntry(item);
    }

    _makeCellEntry(cell: Cell): CellEntry {
        return new CellEntry(cell);
    }

    _getPriority(
        map: Map,
        x: number,
        y: number,
        fov?: GWU.fov.FovTracker
    ): number {
        if (!fov) {
            return map.cell(x, y).hasCellFlag(Flags.Cell.STABLE_MEMORY) ? 3 : 1;
        }
        if (fov.isDirectlyVisible(x, y)) {
            return 1;
        } else if (fov.isAnyKindOfVisible(x, y)) {
            return 2;
        } else if (fov.isRevealed(x, y)) {
            return 3;
        }
        return -1; // not visible, or revealed
    }

    _isDim(entry: EntryBase): boolean {
        if (entry === this.highlight) return false;
        return entry.priority > 2 || !!this.highlight;
    }

    _addActorEntry(
        actor: Actor,
        map: Map,
        x: number,
        y: number,
        fov?: GWU.fov.FovTracker
    ): boolean {
        const priority = this._getPriority(map, actor.x, actor.y, fov);
        if (priority < 0 || priority === 3) return false;

        if (actor.hasEntityFlag(Flags.Entity.L_NO_SIDEBAR)) return false;

        const entry = this._makeActorEntry(actor);
        entry.dist = GWU.xy.distanceBetween(x, y, actor.x, actor.y);
        entry.priority = actor.isPlayer() ? 0 : priority;

        this.entries.push(entry);
        return true;
    }

    _addItemEntry(
        item: Item,
        map: Map,
        x: number,
        y: number,
        fov?: GWU.fov.FovTracker
    ): boolean {
        const priority = this._getPriority(map, item.x, item.y, fov);
        if (priority < 0) return false;

        if (item.hasEntityFlag(Flags.Entity.L_NO_SIDEBAR)) return false;

        const entry = this._makeItemEntry(item);
        entry.dist = GWU.xy.distanceBetween(x, y, item.x, item.y);
        entry.priority = priority;

        this.entries.push(entry);
        return true;
    }

    _addCellEntry(
        cell: Cell,
        map: Map,
        x: number,
        y: number,
        fov?: GWU.fov.FovTracker
    ): boolean {
        const priority = this._getPriority(map, cell.x, cell.y, fov);
        if (priority < 0) return false;

        const entry = this._makeCellEntry(cell);
        entry.dist = GWU.xy.distanceBetween(x, y, cell.x, cell.y);
        entry.priority = priority;

        this.entries.push(entry);
        return true;
    }

    _updateEntryCache(
        map: Map,
        cx: number,
        cy: number,
        fov?: GWU.fov.FovTracker
    ) {
        if (
            map === this.lastMap &&
            cx === this.lastX &&
            cy === this.lastY &&
            !map.hasMapFlag(
                Flags.Map.MAP_SIDEBAR_CHANGED |
                    Flags.Map.MAP_SIDEBAR_TILES_CHANGED
            )
        ) {
            return false;
        }

        map.clearMapFlag(Flags.Map.MAP_SIDEBAR_CHANGED);

        this.clearHighlight(); // If we are moving around the map, then turn off the highlight
        this.lastMap = map;
        this.lastX = cx;
        this.lastY = cy;

        this.entries.length = 0;
        const done = GWU.grid.alloc(map.width, map.height);

        map.eachActor((a) => {
            const x = a.x;
            const y = a.y;
            if (!done[x][y] && this._addActorEntry(a, map, cx, cy, fov)) {
                done[x][y] = 1;
                a.setEntityFlag(Flags.Entity.L_IN_SIDEBAR);
            } else {
                a.clearEntityFlag(Flags.Entity.L_IN_SIDEBAR);
            }
        });

        map.eachItem((i) => {
            const x = i.x;
            const y = i.y;
            if (!done[x][y] && this._addItemEntry(i, map, cx, cy, fov)) {
                i.setEntityFlag(Flags.Entity.L_IN_SIDEBAR);
                done[x][y] = 1;
            } else {
                i.clearEntityFlag(Flags.Entity.L_IN_SIDEBAR);
            }
        });

        this.cellCache.forEach((c) => {
            if (done[c.x][c.y]) return;
            if (this._addCellEntry(c, map, cx, cy, fov)) {
                done[c.x][c.y] = 1;
            }
        });

        this.entries.sort((a, b) => {
            if (a.priority != b.priority) {
                return a.priority - b.priority;
            }
            return a.dist - b.dist;
        });

        GWU.grid.free(done);
        return true;
    }

    update(): boolean {
        if (!this.subject) {
            return false;
        }
        return this.updateFor(this.subject);
    }

    updateFor(subject: UISubject): boolean {
        if (!subject.map) return false;

        return this.updateAt(
            subject.map,
            subject.x,
            subject.y,
            subject.map.fov
        );
    }

    updateAt(
        map: Map,
        cx: number,
        cy: number,
        fov?: GWU.fov.FovTracker
    ): boolean {
        let changed = this._updateCellCache(map);
        if (this._updateEntryCache(map, cx, cy, fov)) {
            changed = true;
        }
        return changed;
    }

    draw(buffer: GWU.buffer.Buffer) {
        const map = this.subject?.map;
        if (!map) return false;
        if (this.update()) {
            this.needsDraw = true;
        }

        if (!this.needsDraw) return false;
        this.needsDraw = false;

        buffer.fillRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            0,
            0,
            this.bg
        );

        // clear the row information
        this.entries.forEach((e) => (e.sidebarY = -1));

        const drawBounds = this.bounds.clone();
        let currentEntry: EntryBase;

        for (let i = 0; i < this.entries.length && drawBounds.height > 0; ++i) {
            currentEntry = this.entries[i];
            currentEntry.sidebarY = drawBounds.y;
            let usedLines = currentEntry.draw(buffer, drawBounds);
            if (this._isDim(currentEntry) && this.bg) {
                buffer.mix(
                    this.bg,
                    50,
                    drawBounds.x,
                    drawBounds.y,
                    drawBounds.width,
                    usedLines
                );
            }
            if (usedLines) {
                ++usedLines; // skip a space
                drawBounds.y += usedLines;
                drawBounds.height -= usedLines;
            }
        }

        return true;
    }
}
