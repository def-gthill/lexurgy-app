import { Language } from "@/pages/api/language";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageOverview() {
  const router = useRouter();
  const { id } = router.query;
  const { data: language, error } = useSWR<Language, Error>(
    `/api/language/${id}`,
    fetcher
  );
  if (error !== undefined) {
    return <div>Language not found</div>;
  } else if (language === undefined) {
    return <div>Loading language...</div>;
  }
  return (
    <>
      <Head>
        <title>Lexurgy - {language.name}</title>
        <meta
          name="description"
          content={`"${language.name}, a constructed language"`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main>
        <div>{language.name}</div>
      </main>
    </>
  );
}
