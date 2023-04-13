import Language from "@/models/Language";
import Translation from "@/models/Translation";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";

export default function TranslationEditor({
  language,
  saveTranslation,
}: {
  language: Language;
  saveTranslation: (translation: Translation) => void;
}) {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  return (
    <>
      <Label.Root htmlFor="text">{language.name} Text</Label.Root>
      <input
        type="text"
        id="text"
        onChange={(event) => setText(event.target.value)}
        value={text}
      ></input>
      <Label.Root htmlFor="translation">Free Translation</Label.Root>
      <input
        type="text"
        id="translation"
        onChange={(event) => setTranslation(event.target.value)}
        value={translation}
      ></input>
      <button
        onClick={() =>
          saveTranslation({
            languageId: language.id,
            romanized: text,
            translation: translation,
          })
        }
      >
        Save
      </button>
    </>
  );
}
