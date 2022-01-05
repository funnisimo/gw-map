import * as GWU from 'gw-utils';
import { Game } from './game';

export interface MessageOptions {
    length?: number;
    bg?: GWU.color.ColorBase;
    fg?: GWU.color.ColorBase;
}

export interface MessageInit extends MessageOptions {
    x: number;
    y: number;
    width: number;
    height: number;

    archive: number;
}

export class Messages {
    cache: GWU.message.MessageCache;
    bounds: GWU.xy.Bounds;
    needsDraw = true;
    bg: GWU.color.Color;
    fg: GWU.color.Color;

    constructor(opts: MessageInit) {
        this.bounds = new GWU.xy.Bounds(
            opts.x,
            opts.y,
            opts.width,
            opts.height
        );

        this.bg = GWU.color.from(opts.bg || 'black');
        this.fg = GWU.color.from(opts.fg || 'white');

        if (!this.bounds.height)
            throw new Error('Must provde a height for messages widget.');

        this.cache = new GWU.message.MessageCache({
            width: this.bounds.width,
            length: opts.archive || 40,
            match: () => {
                this.needsDraw = true;
            },
        });
    }

    clear() {
        this.cache.clear();
        this.needsDraw = true;
    }

    click(e: GWU.io.Event, game: Game): false | Promise<void> {
        if (!this.bounds.contains(e)) return false;
        return this.showArchive(game);
    }

    draw(buffer: GWU.buffer.Buffer): boolean {
        if (!this.needsDraw) return false;
        this.needsDraw = false;
        const isOnTop = this.bounds.y < 10;

        // black out the message area
        buffer.fillRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            ' ',
            this.bg,
            this.bg
        );

        this.cache.forEach((line, confirmed, i) => {
            if (i >= this.bounds.height) return;

            const localY = isOnTop ? this.bounds.height - i - 1 : i;
            const y = localY + this.bounds.y;

            buffer.drawText(this.bounds.x, y, line, this.fg);
            if (confirmed && this.bg) {
                buffer.mix(this.bg, 50, this.bounds.x, y, this.bounds.width, 1);
            }
        });

        return true;
    }

    showArchive(game: Game): false | Promise<void> {
        if (this.cache.length <= this.bounds.height) return false;
        return showArchive(this, game);
    }
}

export type ArchiveMode = 'forward' | 'ack' | 'reverse';

export class MessageArchive extends GWU.widget.Widget {
    source: Messages;
    totalCount: number;
    isOnTop: boolean;
    mode: ArchiveMode = 'forward';
    shown: number;

    _timeout: GWU.io.TimerFn | null = null;

    constructor(layer: GWU.widget.WidgetLayer, source: Messages) {
        super(layer, {
            id: 'ARCHIVE',
            tag: 'messages',
            height: source.bounds.height,
            width: source.bounds.width,
            x: 0,
            y: 0,
            tabStop: true,
            depth: 100, // I'm on top
        });
        this.source = source;
        this.isOnTop = this.source.bounds.y < 10;
        this.bounds.height = this.isOnTop
            ? layer.height - source.bounds.y
            : source.bounds.bottom;

        this.totalCount = Math.min(
            source.cache.length,
            this.isOnTop
                ? layer.height - this.source.bounds.top
                : this.source.bounds.bottom
        );

        this.shown = source.bounds.height;
        this._timeout = this.layer.setTimeout(() => this._forward(), 16);

        // confirm them as they are right now...
        this.source.cache.confirmAll();
    }

    contains(): boolean {
        return true; // Eat all mouse activity
    }

    finish() {
        this.layer.finish();
    }

    keypress(e: GWU.io.Event): boolean {
        return this.click(e);
    }

    click(_e: GWU.io.Event): boolean {
        if (this.mode === 'ack') {
            this.mode = 'reverse';
            this.layer.needsDraw = true;
            if (this._timeout) {
                this.layer.clearTimeout(this._timeout);
            }
            this._timeout = this.layer.setTimeout(() => this._reverse(), 16);
        } else if (this.mode === 'reverse') {
            this.finish();
        } else {
            this.mode = 'ack';
            this.shown = this.totalCount;
            if (this._timeout) {
                this.layer.clearTimeout(this._timeout);
                this._timeout = null;
            }
            this.layer.needsDraw = true;
        }
        return true;
    }

    _forward(): boolean {
        // console.log('forward');

        ++this.shown;
        this._timeout = null;
        this.layer.needsDraw = true;
        if (this.shown < this.totalCount) {
            this._timeout = this.layer.setTimeout(() => this._forward(), 16);
        } else {
            this.mode = 'ack';
            this.shown = this.totalCount;
        }
        return true;
    }

    _reverse(): boolean {
        // console.log('reverse');
        --this.shown;
        this._timeout = null;
        if (this.shown <= this.source.bounds.height) {
            this.finish();
        } else {
            this.layer.needsDraw = true;
            this._timeout = this.layer.setTimeout(() => this._reverse(), 16);
        }
        return true;
    }

    _draw(buffer: GWU.buffer.Buffer): boolean {
        let fadePercent = 0;
        // let reverse = this.mode === 'reverse';

        // Count the number of lines in the archive.
        // let totalMessageCount = this.totalCount;
        const isOnTop = this.isOnTop;
        const dbuf = buffer;
        const fg = GWU.color.from(this.source.fg);

        // const dM = reverse ? -1 : 1;
        // const startM = reverse ? totalMessageCount : this.bounds.height;
        // const endM = reverse
        //     ? this.bounds.height + dM + 1
        //     : totalMessageCount + dM;

        const startY = isOnTop
            ? this.shown - 1
            : this.bounds.bottom - this.shown;
        const endY = isOnTop ? 0 : this.bounds.bottom - 1;
        const dy = isOnTop ? -1 : 1;

        dbuf.fillRect(
            this.source.bounds.x,
            Math.min(startY, endY),
            this.bounds.width,
            this.shown,
            ' ',
            this._used.bg,
            this._used.bg
        );

        this.source.cache.forEach((line, _confirmed, j) => {
            const y = startY + j * dy;
            if (isOnTop) {
                if (y < endY) return;
            } else if (y > endY) return;
            fadePercent = Math.floor((50 * j) / this.shown);
            const fgColor = fg.mix(this._used.bg!, fadePercent);
            dbuf.drawText(
                this.source.bounds.x,
                y,
                line,
                fgColor,
                this._used.bg
            );
        });

        if (this.mode === 'ack') {
            const y = this.isOnTop ? 0 : dbuf.height - 1;
            const x =
                this.source.bounds.x > 8
                    ? this.source.bounds.x - 8 // to left of box
                    : Math.min(
                          this.source.bounds.x + this.bounds.width, // just to right of box
                          dbuf.width - 8 // But definitely on the screen - overwrite some text if necessary
                      );
            dbuf.wrapText(x, y, 8, '--DONE--', this._used.bg, this._used.fg);
        }

        return true;
    }
}

export async function showArchive(widget: Messages, game: Game): Promise<void> {
    const layer = new GWU.widget.WidgetLayer(game.ui);
    // @ts-ignore
    const w = new MessageArchive(layer, widget);
    await layer.run();
}
