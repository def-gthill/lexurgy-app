export function update<K, V>(map: [K, V][], newEntry: [K, V]): [K, V][] {
  return [...new Map([...map, newEntry])];
}
