export declare enum Depth {
    ALL_LAYERS = -1,
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
export declare enum Layer {
    L_SUPERPRIORITY,
    L_SECRETLY_PASSABLE,
    L_BLOCKS_MOVE,
    L_BLOCKS_VISION,
    L_BLOCKS_SURFACE,
    L_BLOCKS_LIQUID,
    L_BLOCKS_GAS,
    L_BLOCKS_ITEMS,
    L_BLOCKS_ACTORS,
    L_BLOCKS_EFFECTS,
    L_BLOCKS_DIAGONAL,
    L_INTERRUPT_WHEN_SEEN,
    L_LIST_IN_SIDEBAR,
    L_VISUALLY_DISTINCT,
    L_BRIGHT_MEMORY,
    L_INVERT_WHEN_HIGHLIGHTED,
    L_BLOCKED_BY_STAIRS,
    L_BLOCKS_SCENT,
    L_DIVIDES_LEVEL,
    L_WAYPOINT_BLOCKER,
    L_IS_WALL,
    L_BLOCKS_EVERYTHING
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
    T_BRIDGE,
    T_AUTO_DESCENT,
    T_LAVA,
    T_DEEP_WATER,
    T_IS_FLAMMABLE,
    T_SPONTANEOUSLY_IGNITES,
    T_IS_FIRE,
    T_EXTINGUISHES_FIRE,
    T_IS_SECRET,
    T_IS_TRAP,
    T_SACRED,
    T_UP_STAIRS,
    T_DOWN_STAIRS,
    T_PORTAL,
    T_IS_DOOR,
    T_ALLOWS_SUBMERGING,
    T_ENTANGLES,
    T_REFLECTS,
    T_STAND_IN_TILE,
    T_CONNECTS_LEVEL,
    T_HAS_STAIRS,
    T_OBSTRUCTS_SCENT,
    T_PATHING_BLOCKER,
    T_DIVIDES_LEVEL,
    T_LAKE_PATHING_BLOCKER,
    T_WAYPOINT_BLOCKER,
    T_MOVES_ITEMS,
    T_CAN_BE_BRIDGED,
    T_IS_DEEP_LIQUID
}
export declare enum TileMech {
    TM_IS_WIRED,
    TM_IS_CIRCUIT_BREAKER,
    TM_VANISHES_UPON_PROMOTION,
    TM_EXPLOSIVE_PROMOTE,
    TM_SWAP_ENCHANTS_ACTIVATION
}
export declare enum Cell {
    VISIBLE,
    WAS_VISIBLE,
    CLAIRVOYANT_VISIBLE,
    WAS_CLAIRVOYANT_VISIBLE,
    TELEPATHIC_VISIBLE,
    WAS_TELEPATHIC_VISIBLE,
    ITEM_DETECTED,
    WAS_ITEM_DETECTED,
    MONSTER_DETECTED,
    WAS_MONSTER_DETECTED,
    REVEALED,
    MAGIC_MAPPED,
    IN_FOV,
    WAS_IN_FOV,
    NEEDS_REDRAW,
    CELL_CHANGED,
    HAS_SURFACE,
    HAS_LIQUID,
    HAS_GAS,
    HAS_PLAYER,
    HAS_ACTOR,
    HAS_DORMANT_MONSTER,
    HAS_ITEM,
    IS_IN_PATH,
    IS_CURSOR,
    STABLE_MEMORY,
    LIGHT_CHANGED,
    CELL_LIT,
    IS_IN_SHADOW,
    CELL_DARK,
    PERMANENT_CELL_FLAGS,
    ANY_KIND_OF_VISIBLE,
    HAS_ANY_ACTOR,
    IS_WAS_ANY_KIND_OF_VISIBLE,
    WAS_ANY_KIND_OF_VISIBLE,
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
    IMPREGNABLE,
    DARKENED,
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
    MAP_CALC_FOV,
    MAP_FOV_CHANGED,
    MAP_DEFAULT
}
