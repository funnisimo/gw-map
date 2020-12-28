export declare enum Layer {
    GROUND = 0,
    LIQUID = 1,
    SURFACE = 2,
    GAS = 3,
    ITEM = 4,
    ACTOR = 5,
    PLAYER = 6,
    FX = 7,
    UI = 8
}
export declare enum Activation {
    DFF_SUBSEQ_ALWAYS,
    DFF_SUBSEQ_EVERYWHERE,
    DFF_TREAT_AS_BLOCKING,
    DFF_PERMIT_BLOCKING,
    DFF_ACTIVATE_DORMANT_MONSTER,
    DFF_BLOCKED_BY_OTHER_LAYERS,
    DFF_SUPERPRIORITY,
    DFF_AGGRAVATES_MONSTERS,
    DFF_RESURRECT_ALLY,
    DFF_EMIT_EVENT,
    DFF_NO_REDRAW_CELL,
    DFF_ABORT_IF_BLOCKS_MAP,
    DFF_BLOCKED_BY_ITEMS,
    DFF_BLOCKED_BY_ACTORS,
    DFF_ALWAYS_FIRE,
    DFF_NO_MARK_FIRED,
    DFF_PROTECTED,
    DFF_SPREAD_CIRCLE,
    DFF_SPREAD_LINE,
    DFF_NULL_SURFACE,
    DFF_NULL_LIQUID,
    DFF_NULL_GAS,
    DFF_EVACUATE_CREATURES,
    DFF_EVACUATE_ITEMS,
    DFF_BUILD_IN_WALLS,
    DFF_MUST_TOUCH_WALLS,
    DFF_NO_TOUCH_WALLS,
    DFF_ONLY_IF_EMPTY,
    DFF_NULLIFY_CELL
}
export declare enum Tile {
    T_OBSTRUCTS_PASSABILITY,
    T_OBSTRUCTS_VISION,
    T_OBSTRUCTS_ITEMS,
    T_OBSTRUCTS_SURFACE,
    T_OBSTRUCTS_GAS,
    T_OBSTRUCTS_LIQUID,
    T_OBSTRUCTS_TILE_EFFECTS,
    T_OBSTRUCTS_DIAGONAL_MOVEMENT,
    T_GAS,
    T_BRIDGE,
    T_AUTO_DESCENT,
    T_LAVA,
    T_DEEP_WATER,
    T_SPONTANEOUSLY_IGNITES,
    T_IS_FLAMMABLE,
    T_IS_FIRE,
    T_ENTANGLES,
    T_CAUSES_POISON,
    T_CAUSES_DAMAGE,
    T_CAUSES_NAUSEA,
    T_CAUSES_PARALYSIS,
    T_CAUSES_CONFUSION,
    T_CAUSES_HEALING,
    T_IS_TRAP,
    T_CAUSES_EXPLOSIVE_DAMAGE,
    T_SACRED,
    T_UP_STAIRS,
    T_DOWN_STAIRS,
    T_PORTAL,
    T_IS_DOOR,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_DIVIDES_LEVEL,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_OBSTRUCTS_EVERYTHING,
    T_HARMFUL_TERRAIN,
    T_RESPIRATION_IMMUNITIES,
    T_IS_LIQUID,
    T_STAIR_BLOCKERS
}
export declare enum TileMech {
    TM_IS_SECRET,
    TM_PROMOTES_WITH_KEY,
    TM_PROMOTES_WITHOUT_KEY,
    TM_PROMOTES_ON_STEP,
    TM_PROMOTES_ON_ITEM_REMOVE,
    TM_PROMOTES_ON_PLAYER_ENTRY,
    TM_PROMOTES_ON_SACRIFICE_ENTRY,
    TM_PROMOTES_ON_ELECTRICITY,
    TM_ALLOWS_SUBMERGING,
    TM_IS_WIRED,
    TM_IS_CIRCUIT_BREAKER,
    TM_EXTINGUISHES_FIRE,
    TM_VANISHES_UPON_PROMOTION,
    TM_REFLECTS_BOLTS,
    TM_STAND_IN_TILE,
    TM_LIST_IN_SIDEBAR,
    TM_VISUALLY_DISTINCT,
    TM_BRIGHT_MEMORY,
    TM_EXPLOSIVE_PROMOTE,
    TM_CONNECTS_LEVEL,
    TM_INTERRUPT_EXPLORATION_WHEN_SEEN,
    TM_INVERT_WHEN_HIGHLIGHTED,
    TM_SWAP_ENCHANTS_ACTIVATION,
    TM_PROMOTES
}
export declare enum Cell {
    REVEALED,
    VISIBLE,
    WAS_VISIBLE,
    IN_FOV,
    HAS_PLAYER,
    HAS_MONSTER,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    HAS_STAIRS,
    NEEDS_REDRAW,
    CELL_CHANGED,
    IS_IN_PATH,
    IS_CURSOR,
    MAGIC_MAPPED,
    ITEM_DETECTED,
    STABLE_MEMORY,
    CLAIRVOYANT_VISIBLE,
    WAS_CLAIRVOYANT_VISIBLE,
    CLAIRVOYANT_DARKENED,
    IMPREGNABLE,
    TELEPATHIC_VISIBLE,
    WAS_TELEPATHIC_VISIBLE,
    MONSTER_DETECTED,
    WAS_MONSTER_DETECTED,
    LIGHT_CHANGED,
    CELL_LIT,
    IS_IN_SHADOW,
    CELL_DARK,
    PERMANENT_CELL_FLAGS,
    ANY_KIND_OF_VISIBLE,
    HAS_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    CELL_DEFAULT
}
export declare enum CellMech {
    SEARCHED_FROM_HERE,
    PRESSURE_PLATE_DEPRESSED,
    KNOWN_TO_BE_TRAP_FREE,
    CAUGHT_FIRE_THIS_TURN,
    EVENT_FIRED_THIS_TURN,
    EVENT_PROTECTED,
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IS_POWERED,
    IS_IN_MACHINE,
    PERMANENT_MECH_FLAGS
}
export declare enum Map {
    MAP_CHANGED,
    MAP_STABLE_GLOW_LIGHTS,
    MAP_STABLE_LIGHTS,
    MAP_ALWAYS_LIT,
    MAP_SAW_WELCOME,
    MAP_NO_LIQUID,
    MAP_NO_GAS,
    MAP_FOV_CHANGED,
    MAP_DEFAULT
}
