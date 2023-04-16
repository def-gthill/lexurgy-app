import HiddenEditor from "@/components/HiddenEditor";
import LanguageInfo from "@/components/LanguageInfo";
import LexiconEntryEditor from "@/components/LexiconEntryEditor";
import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Fragment } from "react";
import useSWR, { useSWRConfig } from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function LexiconPage() {
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
              onSave={saveLexeme}
            />
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
  }
}
