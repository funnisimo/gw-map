import 'jest-extended';
import * as Attributes from './attribute';

describe('Attributes', () => {
    test('create', () => {
        const myAttr = new Attributes.Attributes({ a: 1, b: 2, c: 3 });

        expect(myAttr.get('a')).toEqual(1);
        expect(myAttr.get('b')).toEqual(2);
        expect(myAttr.get('c')).toEqual(3);

        expect(myAttr.get('a')).toEqual(1);
        expect(myAttr.get('b')).toEqual(2);
        expect(myAttr.get('c')).toEqual(3);

        // @ts-ignore
        expect(myAttr.d).toBeUndefined();
        expect(myAttr.get('d')).toEqual(0);
    });

    test('gain/drain', () => {
        const myAttr = new Attributes.Attributes({ a: 1, b: 2, c: 3 });

        expect(myAttr.get('a')).toEqual(1);
        expect(myAttr.max('a')).toEqual(1);

        myAttr.gain('a', 1);
        expect(myAttr.get('a')).toEqual(2);
        expect(myAttr.max('a')).toEqual(2);

        myAttr.drain('a', 1);
        expect(myAttr.get('a')).toEqual(1);
        expect(myAttr.max('a')).toEqual(2);

        myAttr.restore('a');
        expect(myAttr.get('a')).toEqual(2);
        expect(myAttr.max('a')).toEqual(2);

        myAttr.drain('a', 1);
        expect(myAttr.get('a')).toEqual(1);
        expect(myAttr.max('a')).toEqual(2);

        myAttr.gain('a', 1);
        expect(myAttr.get('a')).toEqual(2);
        expect(myAttr.max('a')).toEqual(2);

        myAttr.restore('a');
        expect(myAttr.get('a')).toEqual(2);
        expect(myAttr.max('a')).toEqual(2); // should this be 3?
    });

    describe('installed', () => {
        beforeAll(() => {
            Attributes.installAttribute({
                str: 10,
                int: 10,
                wis: 10,
                dex: 10,
                con: 10,
                chr: 10,
            });
        });

        afterAll(() => {
            Attributes.installAttribute({}); // clear all attributes
        });

        it('allows to create with default for all...', function () {
            let attrs = new Attributes.Attributes(12);
            Object.keys(Attributes.attributes).forEach((a) => {
                expect(attrs.get(a)).toEqual(12);
            });
        });

        it('will fill in the missing attributes', function () {
            let attrs = new Attributes.Attributes({ str: 12, wis: 12 });
            expect(attrs.get('dex')).toEqual(10);
            expect(attrs.get('str')).toEqual(12);
        });

        it('allows a lot of manipulation', function () {
            let attrs = new Attributes.Attributes(10);

            attrs.set('str', 10);
            expect(attrs.get('str')).toEqual(10);
            expect(attrs.base('str')).toEqual(10);
            expect(attrs.max('str')).toEqual(10);
            attrs.adjust('str', { base: 1 });
            expect(attrs.get('str')).toEqual(11);
            expect(attrs.base('str')).toEqual(11);
            expect(attrs.max('str')).toEqual(11);

            attrs.adjust('str', 1);
            expect(attrs.get('str')).toEqual(12);
            expect(attrs.base('str')).toEqual(11);
            expect(attrs.max('str')).toEqual(11);
            attrs.clearAdjustment('str', 1);
            expect(attrs.get('str')).toEqual(11);
            expect(attrs.base('str')).toEqual(11);
            expect(attrs.max('str')).toEqual(11);

            attrs.adjust('str', { min: 20 });
            expect(attrs.get('str')).toEqual(20);
            attrs.clearAdjustment('str', { min: 20 });
            expect(attrs.get('str')).toEqual(11);

            attrs.adjust('str', { max: 8 });
            expect(attrs.get('str')).toEqual(8);
            attrs.clearAdjustment('str', { max: 8 });
            expect(attrs.get('str')).toEqual(11);

            attrs.adjust('str', { fixed: 19 });
            attrs.adjust('str', 1);
            expect(attrs.get('str')).toEqual(19);
            attrs.clearAdjustment('str', { fixed: 19 });
            expect(attrs.get('str')).toEqual(12);
            attrs.clearAdjustment('str', 1);
            expect(attrs.get('str')).toEqual(11);

            attrs.adjust('str', { base: 1 });
            expect(attrs.get('str')).toEqual(12);
            expect(attrs.base('str')).toEqual(12);
            expect(attrs.max('str')).toEqual(12);
            attrs.adjust('str', 1);
            attrs.adjust('str', { base: -1 });
            expect(attrs.get('str')).toEqual(12);
            expect(attrs.base('str')).toEqual(11);
            expect(attrs.max('str')).toEqual(12);
            attrs.adjust('str', { restore: true });
            expect(attrs.get('str')).toEqual(13);
            attrs.clearAdjustment('str', 1);
            expect(attrs.get('str')).toEqual(12);
            expect(attrs.base('str')).toEqual(12);
            expect(attrs.max('str')).toEqual(12);

            expect(attrs.sustain('str')).toBeFalse();
            attrs.adjust('str', { sustain: true });
            expect(attrs.sustain('str')).toBeTruthy();
            expect(attrs.get('str')).toEqual(12);
            attrs.adjust('str', { base: -1 });
            expect(attrs.get('str')).toEqual(12);
            attrs.clearAdjustment('str', { sustain: true });
            expect(attrs.sustain('str')).toBeFalsy();
            attrs.adjust('str', { base: -1 });
            expect(attrs.get('str')).toEqual(11);
        });

        // describe('RUT.Attributes.adjust', function () {
        //     let player: Attributes.Attributes;
        //     let changeFn: jest.Mock<Attributes.ChangeCallback>;

        //     beforeEach(() => {
        //         player = new Attributes.Attributes(10);
        //         changeFn = jest.fn();
        //         player.changed = changeFn;
        //     });

        //     it('will publish an event if an attribute changes', function () {
        //         expect(player.get('str')).toEqual(10);
        //         let result = player.adjust('str', 1);
        //         expect(result).toEqual({ str: 1 });
        //         expect(player.get('str')).toEqual(11);
        //         expect(player.changed).toHaveBeenCalledWith(player, 'str');

        //         changeFn.mockClear();
        //         result = player.clearAdjustment('str', 1);
        //         expect(result).toEqual({ str: -1 });
        //         expect(player.get('str')).toEqual(10);
        //         expect(player.changed).toHaveBeenCalledWith(player, 'str');
        //     });

        //     it('will publish an event if an attribute changes via obj', function () {
        //         expect(player.get('str')).toEqual(10);
        //         expect(player.get('con')).toEqual(10);
        //         let result = player.adjust({
        //             str: 1,
        //             con: 1,
        //         });
        //         expect(result).toEqual({ str: 1, con: 1 });
        //         expect(player.get('str')).toEqual(11);
        //         expect(player.get('con')).toEqual(11);
        //         expect(player.changed).toHaveBeenCalledWith({
        //             attributes: { str: 1, con: 1 },
        //         });

        //         player.changed.calls.reset();
        //         result = player.clearAdjustment({
        //             str: 1,
        //             con: 1,
        //         });
        //         expect(result).toEqual({ str: -1, con: -1 });
        //         expect(player.get('str')).toEqual(10);
        //         expect(player.get('con')).toEqual(10);
        //         expect(player.changed).toHaveBeenCalledWith({
        //             attributes: { str: -1, con: -1 },
        //         });
        //     });
        // });
    });
});
