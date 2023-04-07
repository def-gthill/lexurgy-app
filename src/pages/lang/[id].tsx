import Language from "@/models/Language";
import Translation from "@/models/Translation";
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
  const [translationEditorText, setTranslationEditorText] = useState("");
  const [translationEditorTranslation, setTranslationEditorTranslation] =
    useState("");
  const router = useRouter();
  const { id } = router.query;
  const { data: language, error } = useSWR<Language, Error>(
    `/api/language/${id}`,
    fetcher
  );
  const { data } = useSWR<Translation[], Error>(
    `/api/translation?language=${id}`
  );
  const translations = data || [];
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
            <input
              type="text"
              id="text"
              onChange={(event) => setTranslationEditorText(event.target.value)}
              value={translationEditorText}
            ></input>
            <Label.Root htmlFor="translation">Free Translation</Label.Root>
            <input
              type="text"
              id="translation"
              onChange={(event) =>
                setTranslationEditorTranslation(event.target.value)
              }
              value={translationEditorTranslation}
            ></input>
            <button
              onClick={() =>
                saveTranslation({
                  romanized: translationEditorText,
                  translation: translationEditorTranslation,
                })
              }
            >
              Save
            </button>
          </>
        )}
        {translations.map((translation) => (
          <>
            <p>
              <i>{translation.romanized}</i>
            </p>
            <p>"{translation.translation}"</p>
          </>
        ))}
      </main>
    </>
  );

  async function saveTranslation(translation: Translation) {
    // Send the translation to the database and wait for a reply.
    //  So should I be posting/patching the *language*?
    //  Or post a translation with the language ID in the translation object?
    // If the reply is an error, show an error message and return, letting the user try again.
    // Otherwise, close the translation editor and revalidate.
  }
}
