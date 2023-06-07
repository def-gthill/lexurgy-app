import Language from "@/language/Language";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useLanguageInfo(): {
  language: Language | undefined;
  error: Error | undefined;
} {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: language, error } = useSWR<Language, Error>(
    router.isReady ? `/api/languages/${id}` : null,
    fetcher
  );
  return { language, error };
}
