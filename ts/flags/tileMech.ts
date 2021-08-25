import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// TILE MECH

export enum TileMech {
    // TM_PROMOTES_WITH_KEY = Fl(1), // promotes if the key is present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_WITHOUT_KEY = Fl(2), // promotes if the key is NOT present on the tile (in your pack, carried by monster, or lying on the ground)
    // TM_PROMOTES_ON_STEP = Fl(3), // promotes when a creature, player or item is on the tile (whether or not levitating)
    // TM_PROMOTES_ON_ITEM_REMOVE = Fl(4), // promotes when an item is lifted from the tile (primarily for altars)
    // TM_PROMOTES_ON_PLAYER_ENTRY = Fl(5), // promotes when the player enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_SACRIFICE_ENTRY = Fl(6), // promotes when the sacrifice target enters the tile (whether or not levitating)
    // TM_PROMOTES_ON_ELECTRICITY = Fl(7), // promotes when hit by a lightning bolt

    // T_CAUSES_POISON = Fl(18), // any non-levitating creature gets 10 poison
    // T_CAUSES_DAMAGE = Fl(19), // anything on the tile takes max(1-2, 10%) damage per turn
    // T_CAUSES_NAUSEA = Fl(20), // any creature on the tile becomes nauseous
    // T_CAUSES_PARALYSIS = Fl(21), // anything caught on this tile is paralyzed
    // T_CAUSES_CONFUSION = Fl(22), // causes creatures on this tile to become confused
    // T_CAUSES_HEALING = Fl(23), // heals 20% max HP per turn for any player or non-inanimate monsters
    // T_CAUSES_EXPLOSIVE_DAMAGE = Fl(25), // is an explosion; deals higher of 15-20 or 50% damage instantly, but not again for five turns

    TM_IS_WIRED = Fl(9), // if wired, promotes when powered, and sends power when promoting
    TM_IS_CIRCUIT_BREAKER = Fl(10), // prevents power from circulating in its machine

    TM_VANISHES_UPON_PROMOTION = Fl(15), // vanishes when creating promotion dungeon feature, even if the replacement terrain priority doesn't require it

    TM_EXPLOSIVE_PROMOTE = Fl(21), // when burned, will promote to promoteType instead of burningType if surrounded by tiles with T_IS_FIRE or TM_EXPLOSIVE_PROMOTE
    TM_SWAP_ENCHANTS_ACTIVATION = Fl(25), // in machine, swap item enchantments when two suitable items are on this terrain, and activate the machine when that happens

    // TM_PROMOTES = TM_PROMOTES_WITH_KEY |
    //   TM_PROMOTES_WITHOUT_KEY |
    //   TM_PROMOTES_ON_STEP |
    //   TM_PROMOTES_ON_ITEM_REMOVE |
    //   TM_PROMOTES_ON_SACRIFICE_ENTRY |
    //   TM_PROMOTES_ON_ELECTRICITY |
    //   TM_PROMOTES_ON_PLAYER_ENTRY,
}
