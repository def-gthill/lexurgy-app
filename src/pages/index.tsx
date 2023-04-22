import Header from "@/components/Header";
import HiddenEditor from "@/components/HiddenEditor";
import LanguageInfoEditor from "@/components/LanguageInfoEditor";
import Language from "@/models/Language";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Home() {
  const { data: languages, error } = useSWR<Language[], Error>(
    "/api/languages",
    fetcher
  );
  const { mutate } = useSWRConfig();
  if (error !== undefined) {
    return (
      <>
        <Header />
        <main>
          <div>Error loading workspace</div>
        </main>
      </>
    );
  } else if (languages === undefined) {
    return (
      <>
        <Header />
        <main>
          <div>Loading workspace...</div>
        </main>
      </>
    );
  }
  languages.sort((a: Language, b: Language) => a.name.localeCompare(b.name));
  return (
    <>
      <Head>
        <title>Lexurgy</title>
        <meta name="description" content="A high-powered conlanger's toolkit" />
      </Head>
      <Header />
      <main>
        <h1>My Workspace</h1>
        <h2>Languages</h2>
        <HiddenEditor
          showButtonLabel="New Language"
          component={(value, onChange) => (
            <LanguageInfoEditor language={value} onChange={onChange} />
          )}
          initialValue={{ name: "" }}
          onSave={saveLanguage}
        />
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
  }
}
