import LanguagePage from "@/components/LanguagePage";
import GlitchView from "@/components/glitches/GlitchView";
import Glitch from "@/models/Glitch";
import Language from "@/models/Language";
import useReadOnlyPersistentCollection from "@/useReadOnlyPersistentCollection";
import Head from "next/head";
import { useRouter } from "next/router";

export default function GlitchPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const glitchCollection = useReadOnlyPersistentCollection<Glitch>(
    `/api/glitches?language=${id}`
  );

  const glitches = glitchCollection.getOrEmpty();

  return (
    <LanguagePage
      activeLink="Glitches"
      content={(language: Language) => (
        <>
          <Head>
            <title>Lexurgy - {language.name} Glitches</title>
            <meta
              name="description"
              content={`"Glitches for ${language.name}, a constructed language"`}
            />
          </Head>
          <main>
            <h1>{language.name} Glitches</h1>
            {glitches.map((glitch) => (
              <GlitchView glitch={glitch} key={glitch.id} />
            ))}
          </main>
        </>
      )}
    />
  );
}
