import HiddenEditor from "@/components/HiddenEditor";
import LanguagePage from "@/components/LanguagePage";
import TranslationEditor from "@/components/TranslationEditor";
import TranslationView from "@/components/TranslationView";
import Language from "@/models/Language";
import Translation from "@/models/Translation";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LanguageOverview() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useSWR<Translation[], Error>(
    `/api/translations?language=${id}`,
    fetcher
  );
  const translations = data || [];
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
                  language={language}
                  translation={value}
                  onChange={onChange}
                />
              )}
              initialValue={{
                languageId: language.id,
                romanized: "",
                translation: "",
              }}
              onSave={saveTranslation}
            />
            {translations.map((translation) => (
              <TranslationView translation={translation} key={translation.id} />
            ))}
          </main>
        </>
      )}
    />
  );

  async function saveTranslation(translation: Translation) {
    await axios.post("/api/translations", translation);
    mutate(`/api/translations?language=${id}`);
  }
}
