import * as GWM from '.';

describe('path', () => {
    test('simple path', () => {
        const map = GWM.map.make(20, 20, 'FLOOR', 'WALL');

        let path = GWM.path.getPathBetween(map, 2, 3, 8, 9);
        // console.log(path);
        expect(path).not.toBeNull();
        expect(path!.length).toEqual(13);

        path = GWM.path.getPathBetween(map, 2, 3, 8, 9, { eightWays: true });
        // console.log(path);
        expect(path).not.toBeNull();
        expect(path!.length).toEqual(7);
    });
});
