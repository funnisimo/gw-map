import * as GWU from 'gw-utils';
import { Map } from '../map/map';
import { Player } from '../player/player';
import * as Flags from '../flags';

export interface UISubject {
    readonly map: Map | null;
    readonly x: number;
    readonly y: number;
}

export type ViewFilterFn = (
    mixer: GWU.sprite.Mixer,
    x: number,
    y: number,
    map: Map
) => void;

export interface ViewportOptions {
    snap?: boolean;
    filter?: ViewFilterFn;
    lockX?: boolean;
    lockY?: boolean;
    lock?: boolean;
    center?: boolean;
    bg?: GWU.color.ColorBase;

    scent?: boolean;
}

export interface ViewportInit extends ViewportOptions {
    x: number;
    y: number;
    width: number;
    height: number;
}

export class Viewport {
    filter!: ViewFilterFn | null;
    scent: boolean;

    bg: GWU.color.Color;

    offsetX = 0;
    offsetY = 0;
    _subject: UISubject | null = null;
    player: Player | null = null;
    bounds: GWU.xy.Bounds;
    snap: boolean;
    center: boolean;
    lockX: boolean;
    lockY: boolean;

    constructor(opts: ViewportInit) {
        this.bounds = new GWU.xy.Bounds(
            opts.x,
            opts.y,
            opts.width,
            opts.height
        );
        this.bg = GWU.color.from(opts.bg || 'black');

        this.snap = opts.snap || false;
        this.center = opts.center || false;
        this.filter = opts.filter || null;
        this.lockX = opts.lock || opts.lockX || false;
        this.lockY = opts.lock || opts.lockY || false;

        this.scent = opts.scent || false;
    }

    contains(xy: GWU.xy.XY | GWU.xy.Loc): boolean {
        return this.bounds.contains(xy);
    }

    get subject(): Player | UISubject | null {
        return this._subject;
    }
    set subject(subject: Player | UISubject | null) {
        this.center = !!subject;
        if (subject) {
            this.offsetX = subject.x - this.halfWidth();
            this.offsetY = subject.y - this.halfHeight();
        }
        this._subject = subject;
        if (subject && subject instanceof Player) {
            this.player = subject;
        } else {
            this.player = null;
        }
    }

    set lock(v: boolean) {
        this.lockX = v;
        this.lockY = v;
    }

    toMapX(x: number): number {
        return x + this.offsetX - this.bounds.x;
    }

    toMapY(y: number): number {
        return y + this.offsetY - this.bounds.y;
    }

    toInnerX(x: number): number {
        return x - this.bounds.x;
    }

    toInnerY(y: number): number {
        return y - this.bounds.y;
    }

    halfWidth(): number {
        return Math.floor(this.bounds.width / 2);
    }

    halfHeight(): number {
        return Math.floor(this.bounds.height / 2);
    }

    centerOn(map: Map, x: number, y: number) {
        this.center = true;
        this.subject = { x, y, map };
    }

    showMap(map: Map, x = 0, y = 0) {
        this.subject = { x, y, map };
        this.offsetX = x;
        this.offsetY = y;
        this.center = false;
        this.snap = false;
    }

    updateOffset() {
        if (!this._subject) {
            this.offsetX = 0;
            this.offsetY = 0;
            return;
        }

        const subject = this._subject;
        const map = subject.map!;
        const bounds = map;

        if (subject && map.hasXY(subject.x, subject.y)) {
            if (this.snap) {
                let left = this.offsetX;
                let right = this.offsetX + this.bounds.width;
                let top = this.offsetY;
                let bottom = this.offsetY + this.bounds.height;

                // auto center if outside the viewport
                if (subject.x < left || subject.x > right) {
                    left = this.offsetX = subject.x - this.halfWidth();
                    right = left + this.bounds.width;
                }
                if (subject.y < top || subject.y > bottom) {
                    top = this.offsetY = subject.y - this.halfHeight();
                    bottom = top + this.bounds.height;
                }

                const edgeX = Math.floor(this.bounds.width / 5);
                const edgeY = Math.floor(this.bounds.height / 5);

                const thirdW = Math.floor(this.bounds.width / 3);
                if (left + edgeX >= subject.x) {
                    this.offsetX = Math.max(
                        0,
                        subject.x + thirdW - this.bounds.width
                    );
                } else if (right - edgeX <= subject.x) {
                    this.offsetX = Math.min(
                        subject.x - thirdW,
                        bounds.width - this.bounds.width
                    );
                }

                const thirdH = Math.floor(this.bounds.height / 3);
                if (top + edgeY >= subject.y) {
                    this.offsetY = Math.max(
                        0,
                        subject.y + thirdH - this.bounds.height
                    );
                } else if (bottom - edgeY <= subject.y) {
                    this.offsetY = Math.min(
                        subject.y - thirdH,
                        bounds.height - this.bounds.height
                    );
                }
            } else if (this.center) {
                this.offsetX = subject.x - this.halfWidth();
                this.offsetY = subject.y - this.halfHeight();
            } else {
                this.offsetX = subject.x;
                this.offsetY = subject.y;
            }
        }

        if (this.lockX && map) {
            this.offsetX = GWU.clamp(
                this.offsetX,
                0,
                map.width - this.bounds.width
            );
        }
        if (this.lockY && map) {
            this.offsetY = GWU.clamp(
                this.offsetY,
                0,
                map.height - this.bounds.height
            );
        }
    }

    draw(buffer: GWU.buffer.Buffer): boolean {
        if (!this._subject) return false;
        const map = this._subject.map;
        if (!map || !map.needsRedraw) return false;

        const fov = map.fov;

        buffer.blackOutRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            this.bg
        );

        if (!this._subject) {
            return false;
        }

        this.updateOffset();

        const drawer = map.drawer;
        drawer.scent = this.scent;

        const mixer = new GWU.sprite.Mixer();
        for (let x = 0; x < this.bounds.width; ++x) {
            for (let y = 0; y < this.bounds.height; ++y) {
                const mapX = x + this.offsetX;
                const mapY = y + this.offsetY;
                if (map.hasXY(mapX, mapY)) {
                    const cell = map.cell(mapX, mapY);
                    map.drawer.drawCell(mixer, map, cell, fov);
                } else {
                    mixer.draw(' ', this.bg, this.bg); // blackOut
                }

                if (this.filter) {
                    this.filter(mixer, mapX, mapY, map);
                }

                buffer.drawSprite(x + this.bounds.x, y + this.bounds.y, mixer);
            }
        }

        // map.clearMapFlag(GWM.flags.Map.MAP_CHANGED);
        return true;
    }

    tick(_dt: number): boolean {
        if (!this._subject) return false;
        const map = this._subject.map;
        if (!map) return false;

        if (!map.hasMapFlag(Flags.Map.MAP_DANCES) || !GWU.cosmetic.chance(10)) {
            return false;
        }

        map.eachCell((c) => {
            if (
                c.hasCellFlag(Flags.Cell.COLORS_DANCE) &&
                map.fov.isAnyKindOfVisible(c.x, c.y) &&
                GWU.cosmetic.chance(2)
            ) {
                c.needsRedraw = true;
            }
        });
        map.needsRedraw = true;
        return true;
    }

    mousemove(ev: GWU.io.Event): boolean {
        if (!this.bounds.contains(ev.x, ev.y)) {
            this.clearPath();
            return false;
        }
        if (!this.player) return false;
        const map = this.player.map;
        if (!map) return false;

        return this.showPath(this.toInnerX(ev.x), this.toInnerY(ev.y));
    }

    click(ev: GWU.io.Event): boolean {
        if (!this.bounds.contains(ev.x, ev.y)) return false;
        if (!this.player) return false;
        if (this.player.hasGoal()) {
            this.player.clearGoal();
        } else {
            this.player.setGoal(this.toInnerX(ev.x), this.toInnerY(ev.y));
        }
        return true;
    }

    clearPath() {
        if (!this.player) return;
        const map = this.player.map;
        if (!map) return;
        map.clearPath();
    }

    showPath(x: number, y: number): boolean {
        if (!this.player) return false;
        const map = this.player.map;
        if (!map) return false;

        // if (!this.player.hasGoal()) return false;

        // console.log('mouse', ev.x, ev.y);
        const path = this.player.pathTo(x, y);
        if (path) {
            map.highlightPath(path, true);
        } else {
            map.clearPath();
        }
        return true;
    }
}
