import Language from "@/models/Language";
import Fields, { Field } from "./Fields";

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
