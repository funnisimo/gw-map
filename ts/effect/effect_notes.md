```js

    Effect.install('CHASM_EDGE', { tile: 'CHASM_EDGE,100' });
    Effect.install('CHASM_MEDIUM', {
        tile: 'CHASM,150,50',
        flags: 'E_NEXT_EVERYWHERE, E_ABORT_IF_BLOCKS_MAP',
        next: 'CHASM_EDGE',
    });
    const holeEffect = Effect.install('HOLE_WITH_PLATE', {
        effect: 'CHASM_MEDIUM',
        next: { tile: 'PRESSURE_PLATE' },
    });

    const effect = Effect.make([
            { tile: 'CHASM,150,50' flags: 'E_TREAT_AS_BLOCKING' },
            { tile: 'CHASM_EDGE,100', flags: 'E_EVERWHERE' },
            { tile: 'PRESSURE_PLATE' }
        ]);

    const pressurePlateEffects = {
        enter: [{ message: 'the pressure plate depresses.', tile: 'PRESSURE_PLATE_PRESSED', activateMachine: true }]
    }


    const vestibuleEffects = Effect.make([
        { tile: 'LOCKED_DOOR', flags: 'E_PERMIT_BLOCKING, E_IMPREGNABLE' },     // build a locked door at the origin
        { item: 'key', flags: 'E_ITEM_IS_KEY, E_OUTSOURCE_ITEM, E_KEY_DISPOSABLE' }  // generate an item and then give it to a machine (ADOPT_ITEM)
    ]);

    const keyAdopter = Effect.make( { flags: 'ADOPT_ITEM, NOT_IN_HALLWAY', steps: [
        { tile: 'PEDISTAL', flags: 'E_TREAT_AS_BLOCKING' },
        { flags: 'E_ADOPT_ITEM' }
    ]});

    const lockedDoorVestibule = Effect.make({ flags: 'VESTIBULE', size: 0, steps: [
        { tile: 'DOOR_LOCKED', flags: 'PERMIT_BLOCKING, IMPREGNABLE' },
        { item: 'key', flags: 'ITEM_IS_KEY, KEY_DISPOSABLE, OUTSOURCE_ITEM' }
    ]});

    const roomPlan = Effect.make({ falgs: 'ROOM', size: '10-100', steps: [
        { flags: 'BUILD_VESTIBULE' }
    ]});
```

## Effects

-   Are for actions done during gameplay
-   These are async
-   These can do nothing
-   These cannot fail (???)

## BuildActions

-   Are for building the dungeon/map
-   These are not async
-   These can fail
-   These can do nothing (is this a failure?)

Should build actions be in map to allow reuse?

Are build actions just effects?

### Flags

-   E_NEXT_ALWAYS = Fl(0), // Always fire the next effect, even if no tiles changed.
-   E_EVERYWHERE = Fl(1), // next effect spawns in every cell that this effect spawns in, instead of only the origin

-   E_FIRED = Fl(2), // has already been fired once this turn
-   E_NO_MARK_FIRED = Fl(3), // Do not mark this cell as having fired an effect (so can log messages multiple times)

// MUST_REPLACE_LAYER
// NEEDS_EMPTY_LAYER

-   E_PROTECTED = Fl(4),

// E_NO_REDRAW_CELL = Fl(),

-   E_TREAT_AS_BLOCKING = Fl(5), // If filling the footprint of this effect with walls would disrupt level connectivity, then abort.
-   E_PERMIT_BLOCKING = Fl(6), // Generate this effect without regard to level connectivity.
-   E_ABORT_IF_BLOCKS_MAP = Fl(7),
-   E_BLOCKED_BY_ITEMS = Fl(8), // Do not fire this effect in a cell that has an item.
-   E_BLOCKED_BY_ACTORS = Fl(9), // Do not fire this effect in a cell that has an item.
-   E_BLOCKED_BY_OTHER_LAYERS = Fl(10), // Will not propagate into a cell if any layer in that cell has a superior priority.
-   E_SUPERPRIORITY = Fl(11), // Will overwrite terrain of a superior priority.

-   E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
-   E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction

-   E_EVACUATE_CREATURES = Fl(15), // Creatures in the effect area get moved outside of it
-   E_EVACUATE_ITEMS = Fl(16), // Creatures in the effect area get moved outside of it

-   E_BUILD_IN_WALLS = Fl(17),
-   E_MUST_TOUCH_WALLS = Fl(18),
-   E_NO_TOUCH_WALLS = Fl(19),

-   E_CLEAR_GROUND = Fl(21), // clear all existing tiles
-   E_CLEAR_SURFACE = Fl(22),
-   E_CLEAR_LIQUID = Fl(23),
-   E_CLEAR_GAS = Fl(24),

-   E_CLEAR_TILE = Fl(25), // Clear this tile

-   E_CLEAR_CELL = E_CLEAR_GROUND | E_CLEAR_SURFACE | E_CLEAR_LIQUID | E_CLEAR_GAS,

-   E_ONLY_IF_EMPTY = E_BLOCKED_BY_ITEMS | E_BLOCKED_BY_ACTORS,
-   // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,

These should be effect types

-   E_ACTIVATE_DORMANT_MONSTER = Fl(27), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
-   E_AGGRAVATES_MONSTERS = Fl(28), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
-   E_RESURRECT_ALLY = Fl(29), // Will bring back to life your most recently deceased ally.
