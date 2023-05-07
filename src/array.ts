export function set<T>(array: T[], index: number, newValue: T): T[] {
  const newArray = [...array];
  newArray[index] = newValue;
  return newArray;
}

export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function range(stop: number): number[] {
  return [...Array(stop).keys()];
}
