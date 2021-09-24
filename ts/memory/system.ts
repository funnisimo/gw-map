import { Actor } from '../actor/actor';
import { Map } from '../map/map';
import { Memory } from './memory';

type MemoryRecord = Record<string, Memory>;
const cache: Record<string, MemoryRecord> = {};

export function store(actor: Actor, map: Map, memory: Memory) {
    let actorMemory = cache[actor.id];
    if (!actorMemory) {
        cache[actor.id] = actorMemory = {};
    }
    actorMemory[map.id] = memory;
}

export function get(actor: Actor, map: Map): Memory {
    let actorMemory = cache[actor.id];
    if (actorMemory) {
        const memory = actorMemory[map.id];
        if (memory) return memory;
    }
    return new Memory(map);
}
