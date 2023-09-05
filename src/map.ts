export function toMap<V>(obj: Record<string, V>): Map<string, V> {
  return new Map(Object.entries(obj));
}

export function toObject<V>(map: Map<string, V>): Record<string, V> {
  return Object.fromEntries([...map]);
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

export function update<K, V>(map: Map<K, V>, newEntry: [K, V]): Map<K, V> {
  return new Map([...map, newEntry]);
}

export function rekey<K, V>(map: Map<K, V>, key: K, newKey: K): Map<K, V> {
  if (!map.has(key)) {
    throw new Error(`Key not found: ${key}`);
  }
  if (key === newKey) {
    return map;
  }
  const newMap = new Map(entries(map));
  newMap.set(newKey, newMap.get(key)!);
  newMap.delete(key);
  return newMap;
}

export function mapValues<K, V, VResult>(
  map: Map<K, V>,
  f: (value: V) => VResult
) {
  return new Map([...map].map(([key, value]) => [key, f(value)]));
}
