import LanguageInfo from "@/components/LanguageInfo";
import Language from "@/models/Language";
import Word from "@/models/Word";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LexiconPage() {
  const [showingEntryEditor, setShowingEntryEditor] = useState(false);
  const [entryEditorWord, setEntryEditorWord] = useState("");
  const [entryEditorPos, setEntryEditorPos] = useState("");
  const [entryEditorDefinition, setEntryEditorDefinition] = useState("");
  const router = useRouter();
  const id = router.query.id as string;
  const { data } = useSWR<Word[], Error>(`/api/words?language=${id}`, fetcher);
  const words = data || [];
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
                <Label.Root htmlFor="word">{language.name} Word</Label.Root>
                <input
                  type="text"
                  id="word"
                  onChange={(event) => setEntryEditorWord(event.target.value)}
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
                    saveWord({
                      languageId: id,
                      word: entryEditorWord,
                      pos: entryEditorPos,
                      definitions: [entryEditorDefinition],
                    })
                  }
                >
                  Save
                </button>
              </>
            )}
            {words.map((word) => (
              <Fragment key={word.id}>
                <p>
                  <b>{word.word}</b> - <i>{word.pos}</i>
                </p>
                <ol>
                  {word.definitions.map((definition, i) => (
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

  async function saveWord(word: Word) {
    await axios.post("/api/words", word);
    mutate(`/api/words?language=${id}`);
    setShowingEntryEditor(false);
  }
}
