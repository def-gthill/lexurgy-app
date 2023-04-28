import HiddenEditor from "@/components/HiddenEditor";
import LanguagePage from "@/components/LanguagePage";
import TranslationEditor from "@/components/TranslationEditor";
import TranslationView from "@/components/TranslationView";
import Construction from "@/models/Construction";
import Language from "@/models/Language";
import Translation from "@/models/Translation";
import usePersistentCollection from "@/usePersistentCollection";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LanguageOverview() {
  const router = useRouter();
  const id = router.query.id as string;
  const translationCollection = usePersistentCollection<Translation>(
    "/api/translations",
    `/api/translations?language=${id}`
  );
  const translations = translationCollection.getOrEmpty();
  const constructionCollection = usePersistentCollection<Construction>(
    "/api/constructions",
    `/api/constructions?language=${id}`
  );
  const constructions = constructionCollection.getOrEmpty();

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
                    console.log("Called from TranslationEditor.onChange");
                    console.log(value);
                    onChange(value);
                  }}
                />
              )}
              initialValue={{
                languageId: language.id,
                romanized: "",
                translation: "",
              }}
              onSave={(value: Translation) => {
                console.log("Called from HiddenEditor.onSave");
                console.log(value);
                translationCollection.save(value);
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
