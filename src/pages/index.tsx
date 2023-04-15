import LanguageInfoEditor from "@/components/LanguageInfoEditor";
import Language from "@/models/Language";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const [showingLanguageInfoEditor, setShowingLanguageInfoEditor] =
    useState(false);
  const { data: languages, error } = useSWR<Language[], Error>(
    "/api/languages",
    fetcher
  );
  const { mutate } = useSWRConfig();
  if (error !== undefined) {
    return <div>Error loading workspace</div>;
  } else if (languages === undefined) {
    return <div>Loading workspace...</div>;
  }
  languages.sort((a: Language, b: Language) => a.name.localeCompare(b.name));
  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <main>
        <h1>My Workspace</h1>
        <h2>Languages</h2>
        {showingLanguageInfoEditor ? (
          <LanguageInfoEditor saveLanguage={saveLanguage} />
        ) : (
          <button onClick={() => setShowingLanguageInfoEditor(true)}>
            New Language
          </button>
        )}
        {languages.map((language) => (
          <Link
            className="card"
            key={language.id}
            href={`/language/${language.id}`}
          >
            {language.name}
          </Link>
        ))}
      </main>
    </>
  );

  async function saveLanguage(language: Language) {
    await axios.post("/api/languages", language);
    mutate(`/api/languages`);
    setShowingLanguageInfoEditor(false);
  }
}
