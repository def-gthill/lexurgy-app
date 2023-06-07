import Fields, { Field } from "@/components/Fields";
import Language from "@/language/Language";

export default function LanguageInfoEditor({
  language,
  onChange,
}: {
  language: Language;
  onChange: (newLanguage: Language) => void;
}) {
  return (
    <Fields>
      <Field
        id="name"
        name="Language Name"
        value={language.name}
        onChange={(value) => onChange({ ...language, name: value })}
      />
    </Fields>
  );
}
