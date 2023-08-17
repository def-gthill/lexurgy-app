import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Construction from "@/syntax/Construction";
import Translation from "@/translation/Translation";
import TranslationEditor from "@/translation/TranslationEditor";
import TranslationView from "@/translation/TranslationView";
import usePersistentCollection from "@/usePersistentCollection";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

export default function LanguageOverview() {
  const router = useRouter();
  const id = router.query.id as string;
  const translationCollection = usePersistentCollection<
    Translation,
    Translation
  >("/api/translations", `/api/translations?language=${id}`);
  const translations = translationCollection.getOrEmpty();
  const constructionCollection = usePersistentCollection<
    Construction,
    Construction
  >("/api/constructions", `/api/constructions?language=${id}`);
  const constructions = constructionCollection.getOrEmpty();
  const { mutate } = useSWRConfig();

  return (
    <LanguagePage
      activeLink="Main"
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
            <HiddenEditor
              showButtonLabel="Add Translation"
              component={(value, onChange) => (
                <TranslationEditor
                  constructions={constructions}
                  translation={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
              initialValue={{
                languageId: language.id,
                romanized: "",
                translation: "",
              }}
              onSave={async (value: Translation) => {
                const savedTranslation = await translationCollection.save(
                  value
                );
                if (savedTranslation.id) {
                  await axios.post(
                    `/api/translations/${savedTranslation.id}/check`
                  );
                  mutate(`/api/glitches?language=${language.id}`);
                }
              }}
            />
            {translations.map((translation) => (
              <TranslationView
                constructions={constructions}
                translation={translation}
                key={translation.id}
                onUpdate={translationCollection.save}
                onDelete={translationCollection.delete}
              />
            ))}
          </main>
        </>
      )}
    />
  );
}
