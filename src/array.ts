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

export function editLast<T>(array: T[], edit: (last: T) => T) {
  if (array.length === 0) {
    return;
  }
  array.push(edit(array.pop()!));
}

export function updateAssociationArray<K, V>(
  array: [K, V][],
  newEntry: [K, V]
): [K, V][] {
  return [...new Map([...array, newEntry])];
}
