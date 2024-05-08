import Editor from "@/components/Editor";
import Language from "@/language/Language";
import Lexeme from "@/lexicon/Lexeme";
import LexiconEntryEditor from "@/lexicon/LexiconEntryEditor";
import LexiconEntryExporter from "@/lexicon/LexiconEntryExporter";
import styles from "@/lexicon/LexiconView.module.css";
import { useState } from "react";

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
  const [exporting, setExporting] = useState(false);
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
  if (onUpdate && editing) {
    return (
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
    );
  } else if (exporting) {
    return (
      <LexiconEntryExporter lexeme={entry} onDone={() => setExporting(false)} />
    );
  } else {
    return (
      <li className="card" style={{ display: "flex", alignItems: "center" }}>
        <div style={{ flexGrow: 1 }}>{content}</div>
        <div className="buttons">
          {onUpdate && <button onClick={() => setEditing(true)}>Edit</button>}
          <button onClick={() => setExporting(true)}>Export</button>
        </div>
      </li>
    );
  }
}
