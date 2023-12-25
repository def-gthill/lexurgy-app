import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Head from "next/head";

export default function LanguageSettingsPage() {
  return (
    <LanguagePage
      activeLink="Settings"
      content={(language: Language) => (
        <>
          <Head>
            <title>Lexurgy - {language.name} Settings</title>
            <meta
              name="description"
              content={`Settings for "${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name} Settings</h1>
          </main>
        </>
      )}
    />
  );
}
