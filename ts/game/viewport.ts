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

export interface ViewportOptions extends GWU.widget.WidgetOpts {
    snap?: boolean;
    filter?: ViewFilterFn;
    lockX?: boolean;
    lockY?: boolean;
    lock?: boolean;
    center?: boolean;

    scent?: boolean;
}

export class Viewport extends GWU.widget.Widget {
    filter!: ViewFilterFn | null;
    scent: boolean;

    bg: GWU.color.Color;

    offsetX = 0;
    offsetY = 0;
    _subject: UISubject | null = null;
    player: Player | null = null;

    constructor(opts: ViewportOptions) {
        super(
            (() => {
                opts.tag = opts.tag || 'viewport';
                return opts;
            })()
        );
        this.bounds = new GWU.xy.Bounds(
            opts.x,
            opts.y,
            opts.width,
            opts.height
        );
        this.bg = GWU.color.from(opts.bg || 'black');

        this.attr('snap', opts.snap || false);
        this.attr('center', opts.center || false);
        this.attr('lockX', opts.lock || opts.lockX || false);
        this.attr('lockY', opts.lock || opts.lockY || false);

        this.filter = opts.filter || null;

        this.scent = opts.scent || false;
    }

    get subject(): Player | UISubject | null {
        return this._subject;
    }
    set subject(subject: Player | UISubject | null) {
        this.attr('center', !!subject);
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
        this.attr('lockX', v);
        this.attr('lockY', v);
    }

    get lockX() {
        return this._attrBool('lockX');
    }
    set lockX(v: boolean) {
        this.attr('lockX', v);
    }

    get lockY() {
        return this._attrBool('lockY');
    }
    set lockY(v: boolean) {
        this.attr('lockY', v);
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
        this.attr('center', true);
        this.subject = { x, y, map };
    }

    showMap(map: Map, x = 0, y = 0) {
        this.subject = { x, y, map };
        this.offsetX = x;
        this.offsetY = y;
        this.attr('center', false);
        this.attr('snap', false);
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
            if (this._attrBool('snap')) {
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
            } else if (this._attrBool('center')) {
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

    _draw(buffer: GWU.buffer.Buffer): void {
        if (!this._subject) return;
        const map = this._subject.map;
        if (!map || !map.needsRedraw) return;

        const fov = map.fov;

        buffer.blackOutRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            this.bg
        );

        if (!this._subject) {
            return;
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
    }

    update(dt: number): void {
        super.update(dt);
        if (!this._subject) return;
        const map = this._subject.map;
        if (!map) return;

        if (!map.hasMapFlag(Flags.Map.MAP_DANCES) || !GWU.cosmetic.chance(10)) {
            return;
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
    }

    _mousemove(ev: GWU.app.Event): void {
        super._mousemove(ev);

        if (!this.bounds.contains(ev.x, ev.y)) {
            this.clearPath();
            return;
        }
        if (!this.player) return;
        const map = this.player.map;
        if (!map) return;

        this.showPath(this.toInnerX(ev.x), this.toInnerY(ev.y));
    }

    _click(ev: GWU.app.Event): void {
        super._click(ev);
        if (!this.player) return;
        if (this.player.hasGoal()) {
            this.player.clearGoal();
        } else {
            this.player.setGoal(this.toInnerX(ev.x), this.toInnerY(ev.y));
        }
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
        map.highlightCell(x, y);
        return true;
    }
}
