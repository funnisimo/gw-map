import * as GAMEOBJ from './gameObj';

describe('GameObj', () => {
    test('layer', () => {
        const obj = GAMEOBJ.make([GAMEOBJ.layer('test')]);
        expect(obj.layer).toEqual('test');
        expect(obj.inspect()).toEqual({ layer: 'test' });
        expect(obj.is('layer')).toBeTruthy();
        expect(obj.is(['layer'])).toBeTruthy();
        expect(obj.is('pos')).toBeFalsy();
        expect(obj.is(['layer', 'pos'])).toBeFalsy();
    });

    test('pos', () => {
        const obj = GAMEOBJ.make([GAMEOBJ.layer('test'), GAMEOBJ.pos()]);
        expect(obj.pos).toEqual({ x: 0, y: 0 });
        obj.moveTo(3, 4);
        expect(obj.pos).toEqual({ x: 3, y: 4 });
        obj.moveBy(1, -1);
        expect(obj.pos).toEqual({ x: 4, y: 3 });
        expect(obj.is('pos')).toBeTruthy();

        expect(obj.layer).toEqual('test');
        expect(obj.inspect()).toEqual({ layer: 'test', pos: '(4, 3)' });
        expect(obj.is('layer')).toBeTruthy();
    });
});
