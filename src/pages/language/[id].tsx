import LanguageInfo from "@/components/LanguageInfo";
import Language from "@/models/Language";
import Translation from "@/models/Translation";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageOverview() {
  const [showingTranslationEditor, setShowingTranslationEditor] =
    useState(false);
  const [translationEditorText, setTranslationEditorText] = useState("");
  const [translationEditorTranslation, setTranslationEditorTranslation] =
    useState("");
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
            {showingTranslationEditor && (
              <>
                <Label.Root htmlFor="text">{language.name} Text</Label.Root>
                <input
                  type="text"
                  id="text"
                  onChange={(event) =>
                    setTranslationEditorText(event.target.value)
                  }
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
                      languageId: id,
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
