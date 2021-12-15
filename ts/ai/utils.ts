import * as GWU from 'gw-utils';
import { Actor } from '../actor';
import * as Flags from '../flags';

export function fillSafetyMap(
    safetyMap: GWU.grid.NumGrid,
    actor: Actor,
    target: Actor
) {
    const costGrid = GWU.grid.alloc(actor.costMap());
    GWU.path.calculateDistances(safetyMap, target.x, target.y, costGrid, true);
    safetyMap.update((v) => v * -1); // Can set factor to be < -1 e.g. -1.2

    actor.map!.actors.forEach((a) => {
        if (a.willAttack(actor)) {
            costGrid[a.x][a.y] = GWU.path.FORBIDDEN; // This is why we allocate a copy
        }
    });

    actor.map!.eachCell((c, x, y) => {
        if (c.hasCellFlag(Flags.Cell.IS_IN_LOOP)) {
            safetyMap[x][y] -= GWU.path.AVOIDED; // loop cells are extra good
        }
    });

    GWU.path.rescan(safetyMap, costGrid, true);
    safetyMap.update((v) => (v <= -30000 ? 30000 : v));
    GWU.grid.free(costGrid);
}
