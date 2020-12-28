import { Random } from "gw-utils";

export const rnd = jest.fn();

export function mockRandom() {
  rnd.mockReturnValue(0.5);
  const make = jest.fn().mockReturnValue(rnd);
  // @ts-ignore
  Random.configure({ make });
  make.mockClear();
}
