import Language from "@/models/Language";
import Translation from "@/models/Translation";
import Fields, { Field } from "./Fields";

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
    <Fields>
      <Field
        id="text"
        name={`${language.name} Text`}
        value={translation.romanized}
        onChange={(value) => onChange({ ...translation, romanized: value })}
      />
      <Field
        id="translation"
        name="Free Translation"
        value={translation.translation}
        onChange={(value) => onChange({ ...translation, translation: value })}
      />
    </Fields>
  );
}
