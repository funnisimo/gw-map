import 'jest-extended';
import * as Status from './status';

describe('Status', function () {
    let status: Status.Status;

    beforeEach(() => {
        status = new Status.Status();
    });

    describe('Counts', function () {
        it('setCount', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setCount('test', 2, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(status.decrement('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('setCount is max of value or count', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setCount('test', 2, done)).toBeTruthy();
            expect(status.setCount('test', 1, done)).toBeFalsy();
            expect(status.get('test')).toBeTrue();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(status.decrement('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('increment', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.increment('test', 2, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(status.decrement('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('double setCount', async function () {
            const done = jest.fn();
            const done2 = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setCount('test', 4, done)).toBeTruthy();
            expect(status.setCount('test', 2, done2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.decrement('test', 2)).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
        });

        it('double increment', async function () {
            const done = jest.fn();
            const done2 = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.increment('test', 1, done)).toBeTruthy();
            expect(status.increment('test', 1, done2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.decrement('test')).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
            expect(status.decrement('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
        });

        it('clearCount', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setCount('test', 2, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(status.clearCount('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });
    });

    describe('On/Off', function () {
        it('can be turned on and off', async function () {
            const done = jest.fn();
            const done2 = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setOn('test', done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.setOn('test', done2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.setOff('test')).toBeTruthy();
            expect(done).toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
            expect(status.get('test')).toBeFalsy();
            expect(status.setOff('test')).toBeFalsy();
        });
    });

    describe('Time', function () {
        it('setTime', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setTime('test', 10, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 10)).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('sets to max of set and current', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.setTime('test', 5, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.setTime('test', 5, done)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.setTime('test', 10, done)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.setTime('test', 5, done)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 6)).toBeFalsy();
            expect(status.removeTime('test', 10)).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('addTime', async function () {
            const done = jest.fn();
            const done2 = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.addTime('test', 5, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.addTime('test', 5, done)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 6)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(done).not.toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
            expect(status.removeTime('test', 10)).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
            expect(done2).not.toHaveBeenCalled();
        });

        it('clearTime', async function () {
            const done = jest.fn();

            expect(status.get('test')).toBeFalsy();
            expect(status.clearTime('test')).toBeFalsy();
            expect(status.setTime('test', 10, done)).toBeTruthy();
            expect(status.get('test')).toBeTruthy();
            expect(status.removeTime('test', 2)).toBeFalsy();
            expect(status.get('test')).toBeTruthy();
            expect(status.clearTime('test')).toBeTruthy();
            expect(status.get('test')).toBeFalsy();
            expect(done).toHaveBeenCalled();
        });

        it('decayAllTimes', async function () {
            const doneApple = jest.fn();
            const doneBanana = jest.fn();

            expect(status.get('apple')).toBeFalsy();
            expect(status.get('banana')).toBeFalsy();
            expect(status.setTime('apple', 5, doneApple)).toBeTruthy();
            expect(status.setTime('banana', 10, doneBanana)).toBeTruthy();

            expect(status.get('apple')).toBeTruthy();
            expect(status.get('banana')).toBeTruthy();

            expect(status.decayAllTimes(3)).toBeFalsy();
            expect(status.decayAllTimes(3)).toEqual({
                apple: false,
            });
            expect(doneApple).toHaveBeenCalled();
            expect(doneBanana).not.toHaveBeenCalled();
            expect(status.get('apple')).toBeFalsy();
            expect(status.get('banana')).toBeTruthy();
            expect(status.decayAllTimes(8)).toEqual({
                banana: false,
            });
            expect(doneBanana).toHaveBeenCalled();
            expect(status.get('apple')).toBeFalsy();
            expect(status.get('banana')).toBeFalsy();
        });
    });

    describe('Status', function () {
        let flag: string;

        beforeEach(() => {
            flag = 'test';
        });

        describe('constructor', function () {
            it('is defaulted to off', function () {
                expect(status.get(flag)).toBeFalsy();
            });

            it('can be set with no value', function () {
                status.setOn(flag);
                expect(status.get(flag)).toBeTruthy();
            });

            // it('can be constructed with a boolean value', function() {
            //   status.setOn(flag, true);
            //   expect(status.get(flag)).toBeTruthy();
            //
            //   status.setOn(flag, false);
            //   expect(status.get(flag)).toBeFalsy();
            // });

            it('can be added with no value', function () {
                status.addTime(flag);
                expect(status.get(flag)).toBeTruthy();
                status.removeTime(flag);
                expect(status.get(flag)).toBeFalsy();
            });

            // it('can be constructed with an object', function() {
            //   status.addTime(flag, { set: true });
            //   expect(status.get(flag)).toBeTruthy();
            //
            //   status.addTime( flag, { set: false });
            //   expect(status.get(flag)).toBeFalsy();
            //
            //   status.addTime(flag, { time: 1 });
            //   expect(status.get(flag)).toBeTruthy();
            //
            //   status.addTime(flag, { time: [1,10] });
            //   expect(status.get(flag)).toBeTruthy();
            //
            //   status.addTime(flag, { time: 0 });
            //   expect(status.get(flag)).toBeFalsy();
            // });

            it('can be constructed with a done fn', function () {
                let fn = jest.fn();
                status.addTime(flag, 1, fn);

                expect(fn).not.toHaveBeenCalled();
                expect(status.get(flag)).toBeTrue();
                status.removeTime(flag);
                expect(status.get(flag)).toBeFalsy();
                expect(fn).toHaveBeenCalled();
            });

            // it('allows the decay function in the opts', function() {
            //   let fn = jest.fn();
            //   status.addTime(flag, { time: 1, done: fn } });
            //
            //   expect(fn).not.toHaveBeenCalled();
            //   expect(status.get(flag)).toBeTruthy();
            //   status.decay(); // need to do it twice b/c of issues with where decay gets called in the framework.
            //   status.decay();
            //   expect(status.get(flag)).toBeFalsy();
            //   expect(fn).toHaveBeenCalled();
            // });
        });

        describe('increment', function () {
            it('allows incrment/decrement of count', function () {
                let fn = jest.fn();

                expect(status.get(flag)).toBeFalsy();
                status.increment(flag, 2, fn);
                expect(status.get(flag)).toBeTrue();
                status.decrement(flag);
                expect(status.get(flag)).toBeTrue();
                status.decrement(flag);
                expect(status.get(flag)).toBeFalse();
                expect(fn).toHaveBeenCalled();
            });
        });

        describe('clear', function () {
            it('can clear set', function () {
                status.setOn(flag);
                expect(status.get(flag)).toBeTruthy();
                status.setOff(flag);
                expect(status.get(flag)).toBeFalsy();
            });

            // it('can clear set', function() {
            //   status.adjust(flag, true);
            //   expect(status.get(flag)).toBeTruthy();
            //   status.setOff(flag, { set: true });
            //   expect(status.get(flag)).toBeFalsy();
            //
            //   status.adjust(flag, true);
            //   expect(status.get(flag)).toBeTruthy();
            //   status.setOff(flag, 'set');
            //   expect(status.get(flag)).toBeFalsy();
            // });
            //
            // it('can clear time', function() {
            //   status.adjust(flag, 10);
            //   expect(status.get(flag)).toBeTruthy();
            //   status.setOff(flag, { time: true });
            //   expect(status.get(flag)).toBeFalsy();
            //
            //   status.adjust(flag, 10);
            //   expect(status.get(flag)).toBeTruthy();
            //   status.setOff(flag, 'time');
            //   expect(status.get(flag)).toBeFalsy();
            // });
        });
    });

    describe('Flags', function () {
        let done: jest.Mock<Status.StatusCallback>;

        beforeEach(() => {
            done = jest.fn();
        });

        it('can add and remove status', function () {
            for (let x = 0; x < 10; ++x) {
                done.mockClear();
                expect(status.get('test')).toBeFalse();
                let r = status.addTime('test', [1, 20, 20], done);
                expect(r).toBeTruthy();
                expect(status.get('test')).toBeTrue();
                status.clearTime('test');
                expect(done).toHaveBeenCalled();
                expect(status.get('test')).toBeFalsy();
            }
        });

        it('can add and remove multiple times', function () {
            expect(status.addTime('test', 3, done)).toBeTruthy();
            expect(status.removeTime('test')).toBeFalsy();
            expect(done).not.toHaveBeenCalled();
            expect(status.removeTime('test')).toBeFalsy();
            expect(done).not.toHaveBeenCalled();
            expect(status.removeTime('test')).toBeTruthy();
            expect(done).toHaveBeenCalled();
        });
    });
});
