export function toMap<V>(obj: Record<string, V>): Map<string, V> {
  return new Map(Object.entries(obj));
}

export function keys<K>(map: Map<K, unknown>): K[] {
  return [...map.keys()];
}

export function values<V>(map: Map<unknown, V>): V[] {
  return [...map.values()];
}

export function entries<K, V>(map: Map<K, V>): [K, V][] {
  return [...map];
}

export function hasElements(map: Map<unknown, unknown>): boolean {
  return map.size > 0;
}

export function update<K, V>(map: [K, V][], newEntry: [K, V]): [K, V][] {
  return [...new Map([...map, newEntry])];
}
