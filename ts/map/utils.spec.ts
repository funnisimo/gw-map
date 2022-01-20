import * as MAP from '.';
import '../tile/tiles';

describe('path', () => {
    test('simple path', () => {
        const map = MAP.make(20, 20, 'FLOOR', 'WALL');

        let path = MAP.getPathBetween(map, 2, 3, 8, 9);
        // console.log(path);
        expect(path).not.toBeNull();
        expect(path!.length).toEqual(13);
        expect(path![0]).toEqual([2, 3]);
        expect(path![12]).toEqual([8, 9]);

        path = MAP.getPathBetween(map, 2, 3, 8, 9, { eightWays: true });
        // console.log(path);
        expect(path).not.toBeNull();
        expect(path!.length).toEqual(7);
        expect(path![0]).toEqual([2, 3]);
        expect(path![6]).toEqual([8, 9]);
    });
});
