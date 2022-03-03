import * as GWU from 'gw-utils';
import { Map } from '../map/map';
import * as Flags from '../flags';
import * as Tile from '../tile/tile';

GWU.color.install('flavorText', 50, 40, 90);
GWU.color.install('flavorPrompt', 100, 90, 20);

export interface FlavorOptions extends GWU.widget.TextOptions {
    overflow?: boolean;
}

export class Flavor extends GWU.widget.Text {
    overflow: boolean;
    _needsDraw = true;

    constructor(opts: FlavorOptions) {
        super(
            (() => {
                opts.tag = opts.tag || 'flavor';
                return opts;
            })()
        );

        this.overflow = opts.overflow || false;
    }

    showText(text: string): this {
        this.text(text);
        this.removeClass('prompt');
        this.needsDraw = true;
        return this;
    }

    clear(): this {
        this.text('');
        this.removeClass('prompt');
        this.needsDraw = true;
        return this;
    }

    showPrompt(text: string): this {
        this.text(text);
        this.addClass('prompt');
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

    _draw(buffer: GWU.buffer.Buffer): void {
        if (!this._needsDraw) return;
        this._needsDraw = false;
        super._draw(buffer);
    }
}
