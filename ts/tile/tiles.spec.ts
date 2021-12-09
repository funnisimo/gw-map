import * as Tile from './tile';
import '../effect/handlers';
import './tiles';

describe('Tiles', () => {
    test('BRIDGE', () => {
        const tile = Tile.tiles.BRIDGE;
        expect(tile).toBeInstanceOf(Tile.Tile);
        expect(tile.groundTile).toEqual('LAKE');
    });
});
