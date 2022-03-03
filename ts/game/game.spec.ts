import * as TEST from '../../test/utils';
import * as GWU from 'gw-utils';
import * as GAME from './game';
import * as MAP from '../map';
import * as PLAYER from '../player';

import '../effects';
import '../tile/tiles';

describe('Game', () => {
    test('create', () => {
        const game: GAME.GameOptions = {
            makeMap(this: GAME.Game, _opts) {
                return MAP.make(
                    this.viewWidth,
                    this.viewHeight,
                    'FLOOR',
                    'WALL'
                );
            },
            makePlayer() {
                return PLAYER.make({ name: 'Hero' });
            },

            keymap: {
                dir: 'moveDir',
            },

            mouse: true,

            viewport: true,
            messages: true,
            flavor: true,
            sidebar: true,
        };

        const canvas = TEST.mockCanvas(80, 30);
        const app = GWU.app.make({
            canvas,
            scenes: {
                game,
            },
            start: false,
        });

        const scene = app.scene as GAME.Game;
        expect(scene).not.toBeNull();
        expect(scene instanceof GAME.Game).toBeTruthy();
    });
});
