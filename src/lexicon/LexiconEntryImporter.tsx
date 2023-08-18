import { useState } from "react";
import Lexeme, { validateUserLexeme } from "./Lexeme";

export default function LexiconEntryImporter({
  onSave,
}: {
  onSave: (entry: Lexeme) => void;
}) {
  const [showing, setShowing] = useState(false);
  const [editorText, setEditorText] = useState("");
  const [error, setError] = useState<string | null>(null);

  return showing ? (
    <div className="editor">
      <h4 style={{ marginTop: 0 }}>Import Entry</h4>
      <textarea
        id="editor"
        rows={10}
        style={{ whiteSpace: "pre", fontFamily: "monospace", resize: "none" }}
        onChange={(event) => setEditorText(event.target.value)}
      ></textarea>
      {error && <div>{error}</div>}
      <div className="buttons">
        <button
          onClick={() => {
            console.log(editorText);
            const entry = parseEntry(editorText);
            if (typeof entry === "string") {
              setError(entry);
            } else {
              onSave(entry);
              setShowing(false);
            }
          }}
        >
          Save
        </button>
        <button
          onClick={() => {
            setShowing(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  ) : (
    <div style={{ margin: "4px 0" }}>
      <button onClick={() => setShowing(true)}>Import Entry</button>
    </div>
  );
}

function parseEntry(text: string): Lexeme | string {
  try {
    const object = JSON.parse(text);
    const lexeme = validateUserLexeme(object);
    return lexeme;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return e.message;
    } else {
      throw e;
    }
  }
}
