import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import * as Label from "@radix-ui/react-label";

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
    <>
      <Label.Root htmlFor="romanized">{language.name} Word</Label.Root>
      <input
        type="text"
        id="romanized"
        onChange={(event) =>
          onChange({ ...lexeme, romanized: event.target.value })
        }
      ></input>
      <Label.Root htmlFor="pos">Part of Speech</Label.Root>
      <input
        type="text"
        id="pos"
        onChange={(event) => onChange({ ...lexeme, pos: event.target.value })}
      ></input>
      <Label.Root htmlFor="definition">Definition</Label.Root>
      <input
        type="text"
        id="definition"
        onChange={(event) =>
          onChange({ ...lexeme, definitions: [event.target.value] })
        }
      ></input>
    </>
  );
}
