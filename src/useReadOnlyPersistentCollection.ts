import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useReadOnlyPersistentCollection<T>(
  getUrl: string
): ReadOnlyPersistentCollection<T> {
  const { data, error } = useSWR<T[], Error>(getUrl, fetcher);

  return {
    getOrEmpty(): T[] {
      return data || [];
    },

    fold<R>({
      onLoading,
      onError,
      onReady,
    }: {
      onLoading: () => R;
      onError: (error: Error) => R;
      onReady: (data: T[]) => R;
    }): R {
      if (error !== undefined) {
        return onError(error);
      } else if (data === undefined) {
        return onLoading();
      } else {
        return onReady(data);
      }
    },
  };
}

export interface ReadOnlyPersistentCollection<T> {
  getOrEmpty(): T[];

  fold<R>({
    onLoading,
    onError,
    onReady,
  }: {
    onLoading: () => R;
    onError: (error: Error) => R;
    onReady: (data: T[]) => R;
  }): R;
}
