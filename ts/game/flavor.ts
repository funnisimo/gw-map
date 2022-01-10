import * as GWU from 'gw-utils';
import { Map } from '../map/map';
import * as Flags from '../flags';
import * as Tile from '../tile/tile';

GWU.color.install('flavorText', 50, 40, 90);
GWU.color.install('flavorPrompt', 100, 90, 20);

export interface FlavorOptions {
    overflow?: boolean;
    fg?: GWU.color.ColorBase;
    bg?: GWU.color.ColorBase;
    promptFg?: GWU.color.ColorBase;
}

export interface FlavorInit extends FlavorOptions {
    x: number;
    y: number;
    width: number;
}

export class Flavor {
    isPrompt: boolean;
    overflow: boolean;
    needsDraw = true;

    bounds: GWU.xy.Bounds;

    fg: GWU.color.Color;
    bg: GWU.color.Color;
    promptFg: GWU.color.Color;

    text = '';

    constructor(opts: FlavorInit) {
        this.fg = GWU.color.from(opts.fg || 'white');
        this.bg = GWU.color.from(opts.bg || 'black');
        this.promptFg = GWU.color.from(opts.promptFg || 'gold');

        this.bounds = new GWU.xy.Bounds(opts.x, opts.y, opts.width, 1);

        this.overflow = opts.overflow || false;
        this.isPrompt = false;
    }

    showText(text: string): this {
        this.text = text;
        this.isPrompt = false;
        this.needsDraw = true;
        return this;
    }

    clear(): this {
        this.text = '';
        this.isPrompt = false;
        this.needsDraw = true;
        return this;
    }

    showPrompt(text: string): this {
        this.text = text;
        this.isPrompt = true;
        this.needsDraw = true;
        return this;
    }

    getFlavorText(
        map: Map,
        x: number,
        y: number,
        fov?: GWU.fov.FovSystem
    ): string {
        const cell = map.cell(x, y); // KNOWLEDGE / MEMORY !!!
        let buf;

        // let magicItem;
        // let standsInTerrain;
        // let subjectMoving;
        // let prepositionLocked = false;

        // let subject;
        // let verb;
        // let preposition;
        let object = '';
        // let adjective;

        const isAnyKindOfVisible = fov ? fov.isAnyKindOfVisible(x, y) : true;
        const isDirectlyVisible = fov ? fov.isDirectlyVisible(x, y) : true;
        const isRemembered = fov ? fov.isRevealed(x, y) : false;
        const isMapped = fov ? fov.isMagicMapped(x, y) : false;

        let intro: string;
        if (isDirectlyVisible) {
            intro = 'You see';
        } else if (isAnyKindOfVisible) {
            intro = 'You sense';
        } else if (isRemembered) {
            intro = 'You remember seeing';
        } else if (isMapped) {
            intro = 'You expect to see';
        } else {
            return '';
        }

        const actor = cell.hasActor() ? map.actorAt(x, y) : null;
        // const player = actor?.isPlayer() ? actor : null;
        const theItem = cell.hasItem() ? map.itemAt(x, y) : null;

        const standsInTile = cell.hasTileFlag(Flags.Tile.T_STAND_IN_TILE);

        let needObjectArticle = false;
        if (actor) {
            object = actor.getFlavor({
                color: false,
                article: true,
                action: true,
            });
            needObjectArticle = true;
        } else if (theItem) {
            object = theItem.getFlavor({ color: false, article: true });
            needObjectArticle = true;
        }

        let article = standsInTile ? ' in ' : ' on ';

        const groundTile = cell.depthTile(Flags.Depth.GROUND) || Tile.NULL;
        const surfaceTile = cell.depthTile(Flags.Depth.SURFACE);
        const liquidTile = cell.depthTile(Flags.Depth.LIQUID);
        // const gasTile = cell.depthTile(Flags.Depth.GAS);

        let surface = '';
        if (surfaceTile) {
            const tile = surfaceTile;
            if (needObjectArticle) {
                needObjectArticle = false;
                object += ' on ';
            }
            if (tile.hasTileFlag(Flags.Tile.T_BRIDGE)) {
                article = ' over ';
            }
            surface = surfaceTile.getFlavor() + article;
        }

        let liquid = '';
        if (liquidTile) {
            liquid = liquidTile.getFlavor() + ' covering ';
            if (needObjectArticle) {
                needObjectArticle = false;
                object += ' in ';
            }
        }

        if (needObjectArticle) {
            needObjectArticle = false;
            object += ' on ';
        }
        let ground = groundTile.getFlavor({ article: true });

        buf = GWU.text.apply('{{intro}} {{text}}.', {
            intro,
            text: object + surface + liquid + ground,
        });

        return buf;
    }

    draw(buffer: GWU.buffer.Buffer): boolean {
        if (!this.needsDraw) return false;
        this.needsDraw = false;

        buffer.fillRect(
            this.bounds.x,
            this.bounds.y,
            this.bounds.width,
            1,
            ' ',
            this.bg,
            this.bg
        );

        buffer.drawText(
            this.bounds.x,
            this.bounds.y,
            this.text,
            this.fg,
            this.bg,
            this.bounds.width,
            'left'
        );

        return true;
    }
}
