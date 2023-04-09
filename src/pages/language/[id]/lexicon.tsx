import LanguageInfo from "@/components/LanguageInfo";
import Language from "@/models/Language";
import Head from "next/head";

export default function LexiconPage() {
  return (
    <LanguageInfo
      content={(language: Language) => (
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
      )}
    />
  );
}
