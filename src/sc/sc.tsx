import { SavedLanguage } from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import ScRunner from "@/sc/ScRunner";
import Head from "next/head";

export default function Sc({ baseUrl }: { baseUrl: string | null }) {
  return (
    <LanguagePage
      activeLink="Evolution"
      content={(language: SavedLanguage) => (
        <>
          <Head>
            <title>Lexurgy - {language.name} Evolution</title>
            <meta
              name="description"
              content={`"Evolution of ${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name} Evolution</h1>
            <ScRunner
              baseUrl={baseUrl}
              initialSoundChanges={""}
              initialTestWords={[""]}
            />
          </main>
        </>
      )}
    />
  );
}
