import HiddenEditor from "@/components/HiddenEditor";
import Language from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Lexeme from "@/lexicon/Lexeme";
import LexiconEntryEditor from "@/lexicon/LexiconEntryEditor";
import LexiconView from "@/lexicon/LexiconView";
import usePersistentCollection from "@/usePersistentCollection";
import useStateResetter from "@/useStateResetter";
import Head from "next/head";
import { useRouter } from "next/router";

export default function LexiconPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const [resetterKey, reset] = useStateResetter();
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
              key={resetterKey}
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
              onSave={(value: Lexeme) => {
                lexicon.save(value);
                reset();
              }}
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
