import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import Editor from "./Editor";

export default function LexiconEntryEditor({
  language,
  saveLexeme,
}: {
  language: Language;
  saveLexeme: (entry: Lexeme) => void;
}) {
  const [entryEditorRomanized, setEntryEditorRomanized] = useState("");
  const [entryEditorPos, setEntryEditorPos] = useState("");
  const [entryEditorDefinition, setEntryEditorDefinition] = useState("");
  return (
    <Editor
      onSave={() =>
        saveLexeme({
          languageId: language.id,
          romanized: entryEditorRomanized,
          pos: entryEditorPos,
          definitions: [entryEditorDefinition],
        })
      }
    >
      <Label.Root htmlFor="romanized">{language.name} Word</Label.Root>
      <input
        type="text"
        id="romanized"
        onChange={(event) => setEntryEditorRomanized(event.target.value)}
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
        onChange={(event) => setEntryEditorDefinition(event.target.value)}
      ></input>
    </Editor>
  );
}
