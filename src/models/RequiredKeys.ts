export type RequiredKeys<T, K extends keyof T> = Exclude<T, K> &
  Required<Pick<T, K>>;
