import { DependentTranslation } from "@/models/Glitch";
import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import { useState } from "react";
import Editor from "../Editor";
import LexiconEntryEditor from "../LexiconEntryEditor";

export default function TranslationMissingLexemeView({
  language,
  translation,
  missingLexeme,
  addLexeme,
  deleteTranslation,
}: {
  language: Language;
  translation: DependentTranslation;
  missingLexeme: string;
  addLexeme?: (lexeme: Lexeme) => void;
  deleteTranslation?: (id: string) => void;
}) {
  const [addingLexeme, setAddingLexeme] = useState(false);
  return (
    <div className="card">
      <div>
        The non-existent lexeme {`"${missingLexeme}"`} is used in this
        translation.
      </div>
      <div>{translation.value.romanized}</div>
      <div>{translation.value.translation}</div>
      {addLexeme && addingLexeme ? (
        <Editor
          component={(value, onChange) => (
            <LexiconEntryEditor
              language={language}
              lexeme={value}
              onChange={onChange}
            />
          )}
          initialValue={{
            romanized: missingLexeme,
            pos: "",
            definitions: [""],
          }}
          onSave={addLexeme}
        />
      ) : (
        <div className="buttons">
          {addLexeme && (
            <button onClick={() => setAddingLexeme(true)}>Add Lexeme</button>
          )}
          {deleteTranslation && (
            <button
              className="danger"
              onClick={() => deleteTranslation(translation.value.id)}
            >
              Delete Translation
            </button>
          )}
        </div>
      )}
    </div>
  );
}
