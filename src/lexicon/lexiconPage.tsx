import HiddenEditor from "@/components/HiddenEditor";
import { SavedLanguage } from "@/language/Language";
import LanguagePage from "@/language/LanguagePage";
import Lexeme, { LexemeWithLanguageId, SavedLexeme } from "@/lexicon/Lexeme";
import LexiconEntryEditor from "@/lexicon/LexiconEntryEditor";
import LexiconView from "@/lexicon/LexiconView";
import usePersistentCollection from "@/usePersistentCollection";
import Head from "next/head";
import { useRouter } from "next/router";
import LexiconEntryImporter from "./LexiconEntryImporter";

export default function LexiconPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const lexicon = usePersistentCollection<LexemeWithLanguageId, SavedLexeme>(
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
      content={(language: SavedLanguage) => (
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
                romanized: "",
                pos: "",
                definitions: [""],
              }}
              onSave={(value: Lexeme) => {
                lexicon.save({ languageId: language.id, ...value });
              }}
            />
            <LexiconEntryImporter
              onSave={(value: Lexeme) => {
                lexicon.save({ languageId: language.id, ...value });
              }}
            />
            <LexiconView
              language={language}
              lexicon={lexemes}
              onUpdate={(value: Lexeme) =>
                lexicon.save({ languageId: language.id, ...value })
              }
            />
          </main>
        </>
      )}
    />
  );
}
