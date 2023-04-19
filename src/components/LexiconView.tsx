import Language from "@/models/Language";
import Lexeme from "@/models/Lexeme";
import styles from "@/styles/LexiconView.module.css";
import { useState } from "react";
import Editor from "./Editor";
import LexiconEntryEditor from "./LexiconEntryEditor";

export default function LexiconView({
  language,
  lexicon,
  onUpdate,
}: {
  language: Language;
  lexicon: Lexeme[];
  onUpdate?: (newEntry: Lexeme) => void;
}) {
  return (
    <ul>
      {lexicon.map((lexeme) => (
        <LexiconEntryView
          key={lexeme.id}
          language={language}
          entry={lexeme}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

function LexiconEntryView({
  language,
  entry,
  onUpdate,
}: {
  language: Language;
  entry: Lexeme;
  onUpdate?: (newEntry: Lexeme) => void;
}) {
  const [editing, setEditing] = useState(false);
  const content = (
    <>
      <div>
        <b>{entry.romanized}</b> - <i>{entry.pos}</i>
      </div>
      <ol>
        {entry.definitions.map((definition, i) => (
          <li key={i} className={styles.definition}>
            {definition}
          </li>
        ))}
      </ol>
    </>
  );
  if (onUpdate) {
    return editing ? (
      <Editor
        component={(value, onChange) => (
          <LexiconEntryEditor
            language={language}
            lexeme={value}
            onChange={onChange}
          />
        )}
        initialValue={entry}
        onSave={(value) => {
          setEditing(false);
          onUpdate({ ...value, id: entry.id });
        }}
      />
    ) : (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        <div className="buttons">
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      </li>
    );
  }
  return <li className="card">{content}</li>;
}
