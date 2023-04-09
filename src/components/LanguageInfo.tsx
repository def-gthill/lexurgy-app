import Language from "@/models/Language";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageInfo({
  content,
}: {
  content: (language: Language) => JSX.Element;
}) {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: language, error } = useSWR<Language, Error>(
    `/api/languages/${id}`,
    fetcher
  );
  if (error !== undefined) {
    return <div>Language not found</div>;
  } else if (language === undefined) {
    return <div>Loading language...</div>;
  }
  return content(language);
}
