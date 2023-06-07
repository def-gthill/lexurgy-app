import HiddenEditor from "@/components/HiddenEditor";
import LexiconEntryEditor from "@/components/LexiconEntryEditor";
import LexiconView from "@/components/LexiconView";
import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Lexeme from "@/models/Lexeme";
import usePersistentCollection from "@/usePersistentCollection";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LexiconPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const lexicon = usePersistentCollection<Lexeme>(
    "/api/lexemes",
    `/api/lexemes?language=${id}`
  );

  const lexemes = lexicon.getOrEmpty();

  lexemes.sort((a: Lexeme, b: Lexeme) =>
    a.romanized.localeCompare(b.romanized)
  );
  return (
    <LanguagePage
      activeLink="Lexicon"
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
            <HiddenEditor
              showButtonLabel="Add Entry"
              component={(value, onChange) => (
                <LexiconEntryEditor
                  language={language}
                  lexeme={value}
                  onChange={onChange}
                />
              )}
              initialValue={{
                languageId: language.id,
                romanized: "",
                pos: "",
                definitions: [""],
              }}
              onSave={lexicon.save}
            />
            <LexiconView
              language={language}
              lexicon={lexemes}
              onUpdate={lexicon.save}
            />
          </main>
        </>
      )}
    />
  );
}
