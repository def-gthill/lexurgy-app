import Checkbox from "@/components/Checkbox";
import { ExportButton } from "@/components/ExportButton";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { WordHistory } from "./WordHistory";

export default function HistoryExporter({
  histories,
}: {
  histories: WordHistory[];
}) {
  const [exporting, setExporting] = useState(false);
  const [includeInputWords, setIncludeInputWords] = useState(true);
  const [includeStages, setIncludeStages] = useState(true);
  const [includeOutputWords, setIncludeOutputWords] = useState(true);

  const data = histories
    .map((history) => {
      const row = [];
      if (includeInputWords) {
        row.push(history.inputWord);
      }
      if (includeStages) {
        row.push(history.intermediates);
      }
      if (includeOutputWords) {
        row.push(history.outputWord);
      }
      return row.join(" => ");
    })
    .join("\n");

  return exporting ? (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content max-content",
        }}
      >
        <Checkbox
          id="include-input-words"
          checked={includeInputWords}
          onCheckedChange={setIncludeInputWords}
        />
        <Label.Root htmlFor="include-input-words">Input Words</Label.Root>
        <Checkbox
          id="include-stages"
          checked={includeStages}
          onCheckedChange={setIncludeStages}
        />
        <Label.Root htmlFor="include-stages">Stages</Label.Root>
        <Checkbox
          id="include-output-words"
          checked={includeOutputWords}
          onCheckedChange={setIncludeOutputWords}
        />
        <Label.Root htmlFor="include-output-words">Output Words</Label.Root>
      </div>
      <div className="buttons">
        <ExportButton
          fileName="lexurgy.wli"
          data={data}
          onSuccess={() => setExporting(false)}
        />
        <button onClick={() => setExporting(false)}>Cancel</button>
      </div>
    </div>
  ) : (
    <button onClick={() => setExporting(true)}>Export</button>
  );
}
