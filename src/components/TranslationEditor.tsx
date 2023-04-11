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
  const [translationEditorText, setTranslationEditorText] = useState("");
  const [translationEditorTranslation, setTranslationEditorTranslation] =
    useState("");
  return (
    <>
      <Label.Root htmlFor="text">{language.name} Text</Label.Root>
      <input
        type="text"
        id="text"
        onChange={(event) => setTranslationEditorText(event.target.value)}
        value={translationEditorText}
      ></input>
      <Label.Root htmlFor="translation">Free Translation</Label.Root>
      <input
        type="text"
        id="translation"
        onChange={(event) =>
          setTranslationEditorTranslation(event.target.value)
        }
        value={translationEditorTranslation}
      ></input>
      <button
        onClick={() =>
          saveTranslation({
            languageId: language.id,
            romanized: translationEditorText,
            translation: translationEditorTranslation,
          })
        }
      >
        Save
      </button>
    </>
  );
}
