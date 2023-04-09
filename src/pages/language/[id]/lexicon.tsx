import Language from "@/models/Language";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LexiconPage() {
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

  return (
    <>
      <Head>
        <title>Lexurgy - {language.name} Lexicon</title>
        <meta
          name="description"
          content={`"Lexicon for ${language.name}, a constructed language"`}
        />
      </Head>
      <main>
        <h1>{language.name} Lexicon</h1>
      </main>
    </>
  );
}
