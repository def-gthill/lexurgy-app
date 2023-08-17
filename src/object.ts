export function dropKeys<T>(object: T, keys: (keyof T)[]): T {
  const result = { ...object };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
