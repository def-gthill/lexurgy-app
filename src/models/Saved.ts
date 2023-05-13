export type Saved<T> = T & { id: string };

export function mapSaved<T, R>(value: Saved<T>, f: (value: T) => R): Saved<R> {
  return {
    id: value.id,
    ...f(value),
  };
}
