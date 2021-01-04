import { Random } from "gw-utils";
import { Map } from "../ts/map";

export const rnd = jest.fn();

let v = 0;

export function mockRandom() {
  v = 0;
  rnd.mockImplementation(() => {
    v = (v + 17) % 100;
    return v / 100;
  });
  const make = jest.fn().mockReturnValue(rnd);
  // @ts-ignore
  Random.configure({ make });
  make.mockClear();
  return rnd;
}

export async function alwaysAsync(fn: Function, count = 1000) {
  for (let i = 0; i < count; ++i) {
    await fn();
  }
}

export function countTile(map: Map, tile: string) {
  let count = 0;
  map.forEach((cell) => {
    if (cell.hasTile(tile)) ++count;
  });
  return count;
}
