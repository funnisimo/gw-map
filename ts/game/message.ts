import * as GWU from 'gw-utils';

export interface MessageOptions extends GWU.widget.WidgetOpts {
    archive?: number;
}

GWU.app.defaultStyle.add('msgs', { bg: 'darkest_gray', fg: 'white' });
GWU.app.defaultStyle.add('archive', { bg: 'darkest_gray', fg: 'white' });

export class Messages extends GWU.widget.Widget {
    cache: GWU.message.MessageCache;

    constructor(opts: MessageOptions) {
        super(
            (() => {
                opts.tag = opts.tag || 'msgs';
                return opts;
            })()
        );

        if (!this.bounds.height)
            throw new Error('Must provde a height for messages widget.');

        this.cache = new GWU.message.MessageCache({
            width: this.bounds.width,
            length: opts.archive || 40,
            match: () => {
                this.needsDraw = true;
            },
        });

        this.on('click', () => {
            this.showArchive();
        });
    }

    clear() {
        this.cache.clear();
        this.needsDraw = true;
    }

    confirmAll() {
        this.cache.confirmAll();
        this.needsDraw = true;
    }

    draw(buffer: GWU.buffer.Buffer): boolean {
        const isOnTop = this.bounds.y < 10;

        const bg = this._used.bg;
        const fg = this._used.fg;

        // black out the message area
        buffer.fillRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            this.bounds.height,
            ' ',
            bg,
            bg
        );

        this.cache.forEach((line, confirmed, i) => {
            if (i >= this.bounds.height) return;

            const localY = isOnTop ? this.bounds.height - i - 1 : i;
            const y = localY + this.bounds.y;

            buffer.drawText(this.bounds.x, y, line, fg);
            if (confirmed && bg) {
                buffer.mix(bg, 50, this.bounds.x, y, this.bounds.width, 1);
            }
        });

        return true;
    }

    showArchive() {
        if (this.cache.length <= this.bounds.height) return;
        if (!this.scene) return;
        const app = this.scene.app;
        app.scenes.run('msg-archive', this);
    }
}

export type ArchiveMode = 'forward' | 'ack' | 'reverse';

export const ArchiveScene = {
    create(this: GWU.app.Scene) {},
    start(this: GWU.app.Scene, source: Messages) {
        new ArchiveWidget({
            scene: this,
            source,
            id: 'ARCHIVE',
        });
    },
    stop(this: GWU.app.Scene) {
        this.children.forEach((c) => c.destroy());
        this.children = [];
    },
    destroy(this: GWU.app.Scene) {},
};

GWU.app.installScene('msg-archive', ArchiveScene);

export interface ArchiveOpts extends GWU.widget.WidgetOpts {
    source: Messages;
}

export class ArchiveWidget extends GWU.widget.Widget {
    source: Messages;
    totalCount: number;
    isOnTop: boolean;
    mode: ArchiveMode = 'forward';
    shown: number;

    _timeout: GWU.app.TimerFn | null = null;
    _needsDraw = true;

    constructor(opts: ArchiveOpts) {
        super({
            scene: opts.scene,
            id: opts.id || 'ARCHIVE',
            tag: opts.tag || 'archive',
            x: 0,
            y: 0,
            tabStop: true,
            // depth: 100, // I'm on top
        });
        this.source = opts.source;
        this.isOnTop = this.source.bounds.y < 10;
        this.bounds.height = this.isOnTop
            ? this.scene!.height - this.source.bounds.y
            : this.source.bounds.bottom;

        this.totalCount = Math.min(
            this.source.cache.length,
            this.isOnTop
                ? this.scene!.height - this.source.bounds.top
                : this.source.bounds.bottom
        );

        this.shown = this.source.bounds.height;
        this._timeout = this.scene!.wait(16, () => this._forward());

        // confirm them as they are right now...
        this.source.cache.confirmAll();

        this.on('keypress', () => this._next());
        this.on('click', () => this._next());
    }

    set needsDraw(v: boolean) {
        this._needsDraw ||= v;
        super.needsDraw = v;
    }

    contains(): boolean {
        return true; // Eat all mouse activity
    }

    finish() {
        this.scene!.stop();
    }

    _next(): void {
        if (!this.scene) return;

        if (this.mode === 'ack') {
            this.mode = 'reverse';
            this.scene.needsDraw = true;
            if (this._timeout) {
                this._timeout();
            }
            this._timeout = this.scene.wait(16, () => this._reverse());
        } else if (this.mode === 'reverse') {
            this.finish();
        } else {
            this.mode = 'ack';
            this.shown = this.totalCount;
            if (this._timeout) {
                this._timeout();
                this._timeout = null;
            }
            this.scene.needsDraw = true;
        }
    }

    _forward(): void {
        // console.log('forward');
        if (!this.scene) return;

        ++this.shown;
        this._timeout = null;
        this.scene.needsDraw = true;
        if (this.shown < this.totalCount) {
            this._timeout = this.scene.wait(16, () => this._forward());
        } else {
            this.mode = 'ack';
            this.shown = this.totalCount;
        }
    }

    _reverse(): void {
        // console.log('reverse');
        if (!this.scene) return;

        --this.shown;
        this._timeout = null;
        if (this.shown <= this.source.bounds.height) {
            this.finish();
        } else {
            this.scene.needsDraw = true;
            this._timeout = this.scene.wait(16, () => this._reverse());
        }
    }

    _draw(buffer: GWU.buffer.Buffer): void {
        let fadePercent = 0;
        // let reverse = this.mode === 'reverse';

        if (!this._needsDraw) return;
        this._needsDraw = false;

        // Count the number of lines in the archive.
        // let totalMessageCount = this.totalCount;
        const isOnTop = this.isOnTop;
        const dbuf = buffer;
        const fg = GWU.color.from(this._used.fg);

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
    }
}
