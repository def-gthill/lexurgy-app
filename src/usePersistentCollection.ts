import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function usePersistentCollection<T>(
  postUrl: string,
  getUrl?: string
): PersistentCollection<T> {
  getUrl = getUrl || postUrl;

  const { data, error } = useSWR<T[], Error>(getUrl, fetcher);
  const { mutate } = useSWRConfig();

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

    async save(value: T): Promise<void> {
      await axios.post(postUrl, value);
      mutate(getUrl);
    },

    async delete(id: string) {
      const deleteUrl = `${postUrl}/${id}`;
      await axios.delete(deleteUrl);
      mutate(getUrl);
    },
  };
}

export interface PersistentCollection<T> {
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

  save(value: T): Promise<void>;

  delete(id: string): Promise<void>;
}
