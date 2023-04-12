import LanguageInfo from "@/components/LanguageInfo";
import StructuredTranslationEditor from "@/components/StructuredTranslationEditor";
import TranslationEditor from "@/components/TranslationEditor";
import Language from "@/models/Language";
import Translation from "@/models/Translation";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageOverview() {
  const [showingTranslationEditor, setShowingTranslationEditor] =
    useState(false);
  const [
    showingStructuredTranslationEditor,
    setShowingStructuredTranslationEditor,
  ] = useState(false);
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useSWR<Translation[], Error>(
    `/api/translations?language=${id}`,
    fetcher
  );
  const translations = data || [];
  const { mutate } = useSWRConfig();

  return (
    <LanguageInfo
      content={(language: Language) => (
        <>
          <Head>
            <title>Lexurgy - {language.name}</title>
            <meta
              name="description"
              content={`"${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name}</h1>
            <h2>Translations</h2>
            <button onClick={() => setShowingTranslationEditor(true)}>
              Add Translation
            </button>
            <button onClick={() => setShowingStructuredTranslationEditor(true)}>
              Add Structured Translation
            </button>
            {showingTranslationEditor && (
              <TranslationEditor
                language={language}
                saveTranslation={saveTranslation}
              />
            )}
            {showingStructuredTranslationEditor && (
              <StructuredTranslationEditor
                language={language}
                saveTranslation={saveTranslation}
              />
            )}
            {translations.map((translation) => (
              <Fragment key={translation.id}>
                <p>
                  <i>{translation.romanized}</i>
                </p>
                <p>{`"${translation.translation}"`}</p>
              </Fragment>
            ))}
          </main>
        </>
      )}
    />
  );

  async function saveTranslation(translation: Translation) {
    await axios.post("/api/translations", translation);
    mutate(`/api/translations?language=${id}`);
    setShowingTranslationEditor(false);
  }
}
