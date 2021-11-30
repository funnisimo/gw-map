const GWU = require('gw-utils');
const diff = require('jest-diff').diff;

export {};

declare global {
    namespace jest {
        interface Matchers<R> {
            toFloatEqual(value: number): CustomMatcherResult;
            toBeInteger(): CustomMatcherResult;
            toBeInRange(lo: number, hi: number): CustomMatcherResult;
            toBeAtXY(x: number, y: number): CustomMatcherResult;
            toBakeFrom(expected: any): CustomMatcherResult;
            toEqual(other: any): CustomMatcherResult;
        }
    }
}

function toFloatEqual(received: number, expected: number) {
    if (typeof expected !== 'number') {
        return {
            pass: false,
            message: () => `Expected (${expected}) must be a number.`,
        };
    }
    if (typeof received !== 'number') {
        return {
            pass: false,
            message: () => `Received (${received}) must be a number.`,
        };
    }

    const diff = Math.abs(expected - received);

    let success = diff < 0.00001;

    return success
        ? {
              pass: true,
              message: () =>
                  `Expected ${received} not to float equal ${expected}`,
          }
        : {
              pass: false,
              message: () => `Expected ${received} to float equal ${expected}`,
          };
}

function toBeInteger(received: any) {
    if (typeof received !== 'number') {
        throw new Error('expected value to be a number');
    }

    let success = Math.floor(received) == received;

    return success
        ? {
              pass: true,
              message: () => `Expected ${received} not to be an integer`,
          }
        : {
              pass: false,
              message: () => `Expected ${received} to be an integer`,
          };
}

function toBeInRange(received: any, lo: number, hi: number) {
    if (typeof lo !== 'number') {
        throw new Error('expected lo to be a number');
    }
    if (typeof hi !== 'number') {
        throw new Error('expected hi to be a number');
    }
    if (typeof received !== 'number') {
        throw new Error('expected value to be a number');
    }

    let success = received >= lo && received <= hi;

    return success
        ? {
              pass: true,
              message: () =>
                  `Expected ${received} not to be in range [${lo}-${hi}]`,
          }
        : {
              pass: false,
              message: () =>
                  `Expected ${received} to be in range [${lo}-${hi}]`,
          };
}

function toBeAtXY(received: any, x: number, y: number) {
    if (typeof x !== 'number') {
        throw new Error('expected x to be a number');
    }
    if (typeof y !== 'number') {
        throw new Error('expected y to be a number');
    }
    if (!received) {
        throw new Error('expected object to be at XY, but received none.');
    }
    if (typeof received.x !== 'number' || typeof received.y !== 'number') {
        throw new Error('expected value to be object with x and y members');
    }

    let success = received && received.x == x && received.y == y;

    const name = received && received.info ? received.info.id : 'object';

    return success
        ? {
              pass: true,
              message: () => `Expected ${name} not to be at location ${x},${y}`,
          }
        : {
              pass: false,
              message: () =>
                  `Expected ${name} @ ${received.x},${received.y} to be at location ${x},${y}`,
          };
}

function toBakeFrom(received: any, expected: any) {
    const options = {
        comment: 'toBakeFrom',
        // @ts-ignore
        isNot: this.isNot,
        // @ts-ignore
        promise: this.promise,
    };

    let pass = false;
    const e = expected;
    const r = received;

    if (!e || !(e instanceof GWU.color.Color)) {
        return {
            actual: received,
            message: () => 'Expected must be Color instance.',
            pass: false,
        };
    }
    if (!r || !(r instanceof GWU.color.Color)) {
        return {
            actual: received,
            message: () => 'Did not receive Color instance.',
            pass: false,
        };
    }

    pass = r._r === r._r && r._g === e._g && r._b == e._b;

    if (!pass && e._rand) {
        const rnd = e._rand;
        pass = r._r >= e._r && r._r <= e._r + rnd[0] + rnd[1];
        pass = pass && r._g >= e._g && r._g <= e._g + rnd[0] + rnd[2];
        pass = pass && r._b >= e._b && r._b <= e._b + rnd[0] + rnd[3];
    }

    const message = pass
        ? () =>
              // @ts-ignore
              this.utils.matcherHint(
                  'toBakeFrom',
                  undefined,
                  undefined,
                  options
              ) +
              '\n\n' +
              // @ts-ignore
              `Expected: not ${this.utils.printExpected(expected)}\n` +
              // @ts-ignore
              `Received: ${this.utils.printReceived(received)}`
        : () => {
              const diffString = diff(expected, received, {
                  // @ts-ignore
                  expand: this.expand,
              });
              return (
                  // @ts-ignore
                  this.utils.matcherHint(
                      'toBakeFrom',
                      undefined,
                      undefined,
                      options
                  ) +
                  '\n\n' +
                  (diffString && diffString.includes('- Expect')
                      ? `Difference:\n\n${diffString}`
                      : // @ts-ignore
                        `Expected: ${this.utils.printExpected(expected)}\n` +
                        // @ts-ignore
                        `Received: ${this.utils.printReceived(received)}`)
              );
          };

    return { actual: received, message, pass };
}

function toEqual(received: any, expected: any) {
    const options = {
        comment: 'toEqual',
        // @ts-ignore
        isNot: this.isNot,
        // @ts-ignore
        promise: this.promise,
    };

    let matchType = 'equals';
    let pass = false;
    if (received && received.equals) {
        pass = received.equals(expected);
        // console.log('received.equals', pass, received.toString(true), expected.toString(true));
    } else if (expected && expected.equals) {
        pass = expected.equals(received);
        // console.log('expected.equals', pass, received.toString(true), expected.toString(true));
    } else {
        matchType = 'deep equals';
        // @ts-ignore
        pass = this.equals(received, expected);
        // console.log('this.equals', pass, received.toString(true), expected.toString(true));
    }

    const message = pass
        ? () =>
              // @ts-ignore
              this.utils.matcherHint(matchType, undefined, undefined, options) +
              '\n\n' +
              // @ts-ignore
              `Expected: not ${this.utils.printExpected(expected)}\n` +
              // @ts-ignore
              `Received: ${this.utils.printReceived(received)}`
        : () => {
              const diffString = diff(expected, received, {
                  // @ts-ignore
                  expand: this.expand,
              });
              return (
                  // @ts-ignore
                  this.utils.matcherHint(
                      matchType,
                      undefined,
                      undefined,
                      options
                  ) +
                  '\n\n' +
                  (diffString && diffString.includes('- Expect')
                      ? `Difference:\n\n${diffString}`
                      : // @ts-ignore
                        `Expected: ${this.utils.printExpected(expected)}\n` +
                        // @ts-ignore
                        `Received: ${this.utils.printReceived(received)}`)
              );
          };

    return { actual: received, message, pass };
}

expect.extend({
    toFloatEqual,
    toEqual,
    toBakeFrom,
    toBeAtXY,
    toBeInRange,
    toBeInteger,
});
