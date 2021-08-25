export class ItemKind {}

export interface ItemKindOptions {}

export const kinds: Record<string, ItemKind> = {};

export function install(
    _id: string,
    _kind: ItemKind | ItemKindOptions
): ItemKind {
    return new ItemKind();
}

export function get(id: string | ItemKind): ItemKind | null {
    if (id instanceof ItemKind) return id;
    return kinds[id];
}

export function makeKind(_info: ItemKindOptions): ItemKind {
    return new ItemKind();
}
