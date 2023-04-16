import Language from "@/models/Language";
import Translation from "@/models/Translation";
import * as Label from "@radix-ui/react-label";

export default function TranslationEditor({
  language,
  translation,
  onChange,
}: {
  language: Language;
  translation: Translation;
  onChange: (newTranslation: Translation) => void;
}) {
  return (
    <>
      <Label.Root htmlFor="text">{language.name} Text</Label.Root>
      <input
        type="text"
        id="text"
        onChange={(event) =>
          onChange({ ...translation, romanized: event.target.value })
        }
        value={translation.romanized}
      ></input>
      <Label.Root htmlFor="translation">Free Translation</Label.Root>
      <input
        type="text"
        id="translation"
        onChange={(event) =>
          onChange({ ...translation, translation: event.target.value })
        }
        value={translation.translation}
      ></input>
    </>
  );
}
