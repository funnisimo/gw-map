import 'jest-extended';
import * as GWU from 'gw-utils';
import * as Stat from './stat';

describe('Stat', function () {
    let stats: Stat.Stats;
    const stat = 'test';

    beforeEach(() => {
        GWU.rng.random.seed(12345);
        stats = new Stat.Stats();
    });

    test('initializes to value', function () {
        stats.set(stat, 100);
        expect(stats.get(stat)).toEqual(100);
        expect(stats.max(stat)).toEqual(100);
    });

    test('can be set with range', function () {
        stats.set(stat, '2d10');
        expect(stats.get(stat)).toEqual(10);
        expect(stats.max(stat)).toEqual(10);
    });

    test('can be adjusted', function () {
        stats.set(stat, 10);
        expect(stats.get(stat)).toEqual(10);
        expect(stats.max(stat)).toEqual(10);

        stats.drain(stat, 5);
        expect(stats.get(stat)).toEqual(5);

        stats.gain(stat, 10); // keeps to max
        expect(stats.get(stat)).toEqual(10);
    });

    test('can be adjusted over max', function () {
        stats.set(stat, 100);
        stats.gain(stat, 10, true);
        expect(stats.get(stat)).toEqual(110);
        expect(stats.max(stat)).toEqual(100);

        stats.restore(stat);
        expect(stats.get(stat)).toEqual(100);
    });

    test('can be adjusted down to 0', function () {
        stats.set('health', 10);
        expect(stats.get('health')).toEqual(10);

        stats.drain('health', 20);
        expect(stats.get('health')).toEqual(0);
    });
});
