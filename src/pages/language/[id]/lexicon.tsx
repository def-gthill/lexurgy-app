import LanguageInfo from "@/components/LanguageInfo";
import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LexiconPage() {
  const [showingEntryEditor, setShowingEntryEditor] = useState(false);
  const [entryEditorRomanized, setEntryEditorRomanized] = useState("");
  const [entryEditorPos, setEntryEditorPos] = useState("");
  const [entryEditorDefinition, setEntryEditorDefinition] = useState("");
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useSWR<Lexeme[], Error>(
    `/api/lexemes?language=${id}`,
    fetcher
  );
  const lexemes = data || [];
  const { mutate } = useSWRConfig();
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
            <button onClick={() => setShowingEntryEditor(true)}>
              Add Entry
            </button>
            {showingEntryEditor && (
              <>
                <Label.Root htmlFor="romanized">
                  {language.name} Word
                </Label.Root>
                <input
                  type="text"
                  id="romanized"
                  onChange={(event) =>
                    setEntryEditorRomanized(event.target.value)
                  }
                ></input>
                <Label.Root htmlFor="pos">Part of Speech</Label.Root>
                <input
                  type="text"
                  id="pos"
                  onChange={(event) => setEntryEditorPos(event.target.value)}
                ></input>
                <Label.Root htmlFor="definition">Definition</Label.Root>
                <input
                  type="text"
                  id="definition"
                  onChange={(event) =>
                    setEntryEditorDefinition(event.target.value)
                  }
                ></input>
                <button
                  onClick={() =>
                    saveLexeme({
                      languageId: id,
                      romanized: entryEditorRomanized,
                      pos: entryEditorPos,
                      definitions: [entryEditorDefinition],
                    })
                  }
                >
                  Save
                </button>
              </>
            )}
            {lexemes.map((lexeme) => (
              <Fragment key={lexeme.id}>
                <p>
                  <b>{lexeme.romanized}</b> - <i>{lexeme.pos}</i>
                </p>
                <ol>
                  {lexeme.definitions.map((definition, i) => (
                    <li key={i}>{definition}</li>
                  ))}
                </ol>
              </Fragment>
            ))}
          </main>
        </>
      )}
    />
  );

  async function saveLexeme(lexeme: Lexeme) {
    await axios.post("/api/lexemes", lexeme);
    mutate(`/api/lexemes?language=${id}`);
    setShowingEntryEditor(false);
  }
}
