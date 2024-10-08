import ExportButton from "@/components/ExportButton";
import { toPrettyJson } from "@/json";
import Lexeme from "@/lexicon/Lexeme";
import { dropKeys } from "@/object";
import copy from "copy-to-clipboard";

export default function LexiconEntryExporter({
  lexeme,
  onDone,
}: {
  lexeme: Lexeme;
  onDone: () => void;
}) {
  const stringified = toPrettyJson(dropKeys(lexeme, ["id", "languageId"]));
  return (
    <li className="card">
      <textarea
        readOnly
        id="preview"
        rows={Math.min(stringified.split("\n").length, 10)}
        className="export-preview"
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
