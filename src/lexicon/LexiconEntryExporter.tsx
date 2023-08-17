import ExportButton from "@/components/ExportButton";
import copy from "copy-to-clipboard";
import Lexeme from "./Lexeme";

export default function LexiconEntryExporter({
  lexeme,
  onDone,
}: {
  lexeme: Lexeme;
  onDone: () => void;
}) {
  const stringified = JSON.stringify(
    {
      romanized: lexeme.romanized,
      pos: lexeme.pos,
      definitions: lexeme.definitions,
    },
    undefined,
    2
  );
  return (
    <li className="card">
      <textarea
        readOnly
        id="preview"
        rows={Math.min(stringified.split("\n").length, 10)}
        style={{ whiteSpace: "pre", fontFamily: "monospace", resize: "none" }}
      >
        {stringified}
      </textarea>
      <div className="buttons">
        <button
          onClick={() => {
            copy(stringified);
            alert("Copied to clipboard!");
          }}
        >
          Copy
        </button>
        <ExportButton
          label="Download"
          fileName={`${lexeme.romanized}.json`}
          data={stringified}
        />
        <button onClick={() => onDone()}>Done</button>
      </div>
    </li>
  );
}
