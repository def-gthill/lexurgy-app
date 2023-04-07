import { Language } from "@/pages/api/language";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageOverview() {
  const [showingTranslationEditor, setShowingTranslationEditor] =
    useState(false);
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
        <h1>{language.name}</h1>
        <h2>Translations</h2>
        <button onClick={() => setShowingTranslationEditor(true)}>
          Add Translation
        </button>
        {showingTranslationEditor && (
          <>
            <Label.Root htmlFor="text">{language.name} Text</Label.Root>
            <input type="text" id="text"></input>
            <Label.Root htmlFor="translation">Free Translation</Label.Root>
            <input type="text" id="translation"></input>
            <button>Save</button>
          </>
        )}
      </main>
    </>
  );
}
