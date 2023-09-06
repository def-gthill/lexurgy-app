import SchematicEditor from "@/components/SchematicEditor";
import Language from "@/language/Language";
import Lexeme, { lexemeSchema } from "@/lexicon/Lexeme";

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
    <SchematicEditor
      schema={lexemeSchema(language.name)}
      value={lexeme}
      onChange={onChange}
    />
  );
}
