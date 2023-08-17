import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function usePersistentCollection<T, S>(
  postUrl: string,
  getUrl?: string
): PersistentCollection<T, S> {
  getUrl = getUrl || postUrl;

  const { data, error } = useSWR<S[], Error>(getUrl, fetcher);
  const { mutate } = useSWRConfig();

  return {
    getOrEmpty(): S[] {
      return data || [];
    },

    fold<R>({
      onLoading,
      onError,
      onReady,
    }: {
      onLoading: () => R;
      onError: (error: Error) => R;
      onReady: (data: S[]) => R;
    }): R {
      if (error !== undefined) {
        return onError(error);
      } else if (data === undefined) {
        return onLoading();
      } else {
        return onReady(data);
      }
    },

    async save(value: T): Promise<S> {
      const postedValue = (await axios.post<S>(postUrl, value)).data;
      mutate(getUrl);
      return postedValue;
    },

    async delete(id: string) {
      const deleteUrl = `${postUrl}/${id}`;
      await axios.delete(deleteUrl);
      mutate(getUrl);
    },
  };
}

export interface PersistentCollection<T, S> {
  getOrEmpty(): S[];

  fold<R>({
    onLoading,
    onError,
    onReady,
  }: {
    onLoading: () => R;
    onError: (error: Error) => R;
    onReady: (data: S[]) => R;
  }): R;

  save(value: T): Promise<S>;

  delete(id: string): Promise<void>;
}
