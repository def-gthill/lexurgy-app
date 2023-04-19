import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import Fields, { Field } from "./Fields";

export default function LexiconEntryEditor({
  language,
  lexeme,
  onChange,
}: {
  language: Language;
  lexeme: Lexeme;
  onChange: (entry: Lexeme) => void;
}) {
  return (
    <Fields>
      <Field
        id="romanized"
        name={`${language.name} Word`}
        value={lexeme.romanized}
        onChange={(value) => onChange({ ...lexeme, romanized: value })}
      />
      <Field
        id="pos"
        name="Part of Speech"
        value={lexeme.pos}
        onChange={(value) => onChange({ ...lexeme, pos: value })}
      />
      <Field
        id="definition"
        name="Definition"
        value={lexeme.definitions[0]}
        onChange={(value) => onChange({ ...lexeme, definitions: [value] })}
      />
    </Fields>
  );
}