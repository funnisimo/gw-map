import * as GWU from 'gw-utils';

const Fl = GWU.flag.fl;

export enum Horde {
    HORDE_DIES_ON_LEADER_DEATH = Fl(0), // if the leader dies, the horde will die instead of electing new leader
    HORDE_IS_SUMMONED = Fl(1), // minions summoned when any creature is the same species as the leader and casts summon
    HORDE_SUMMONED_AT_DISTANCE = Fl(2), // summons will appear across the level, and will naturally path back to the leader
    HORDE_NO_PERIODIC_SPAWN = Fl(4), // can spawn only when the level begins -- not afterwards
    HORDE_ALLIED_WITH_PLAYER = Fl(5),
    HORDE_NEVER_OOD = Fl(15), // Horde cannot be generated out of depth

    // Move all these to tags?

    // HORDE_LEADER_CAPTIVE = Fl(3), // the leader is in chains and the followers are guards

    // HORDE_MACHINE_BOSS = Fl(6), // used in machines for a boss challenge
    // HORDE_MACHINE_WATER_MONSTER = Fl(7), // used in machines where the room floods with shallow water
    // HORDE_MACHINE_CAPTIVE = Fl(8), // powerful captive monsters without any captors
    // HORDE_MACHINE_STATUE = Fl(9), // the kinds of monsters that make sense in a statue
    // HORDE_MACHINE_TURRET = Fl(10), // turrets, for hiding in walls
    // HORDE_MACHINE_MUD = Fl(11), // bog monsters, for hiding in mud
    // HORDE_MACHINE_KENNEL = Fl(12), // monsters that can appear in cages in kennels
    // HORDE_VAMPIRE_FODDER = Fl(13), // monsters that are prone to capture and farming by vampires
    // HORDE_MACHINE_LEGENDARY_ALLY = Fl(14), // legendary allies
    // HORDE_MACHINE_THIEF = Fl(16), // monsters that can be generated in the key thief area machines
    // HORDE_MACHINE_GOBLIN_WARREN = Fl(17), // can spawn in goblin warrens
    // HORDE_SACRIFICE_TARGET = Fl(18), // can be the target of an assassination challenge; leader will get scary light.

    // HORDE_MACHINE_ONLY = HORDE_MACHINE_BOSS |
    //     HORDE_MACHINE_WATER_MONSTER |
    //     HORDE_MACHINE_CAPTIVE |
    //     HORDE_MACHINE_STATUE |
    //     HORDE_MACHINE_TURRET |
    //     HORDE_MACHINE_MUD |
    //     HORDE_MACHINE_KENNEL |
    //     HORDE_VAMPIRE_FODDER |
    //     HORDE_MACHINE_LEGENDARY_ALLY |
    //     HORDE_MACHINE_THIEF |
    //     HORDE_MACHINE_GOBLIN_WARREN |
    //     HORDE_SACRIFICE_TARGET,
}
