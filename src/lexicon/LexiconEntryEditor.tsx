import SchematicEditor from "@/components/SchematicEditor";
import Language from "@/language/Language";
import Lexeme, { lexemeSchema } from "@/lexicon/Lexeme";
import Fields, { Field } from "../components/Fields";

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

function LexiconEntryEditor_NEW({
  language,
  lexeme,
  onChange,
}: {
  language: Language;
  lexeme: Lexeme;
  onChange: (entry: Lexeme) => void;
}) {
  return (
    <SchematicEditor
      schema={lexemeSchema(language.name)}
      value={lexeme}
      onChange={onChange}
    />
  );
}
