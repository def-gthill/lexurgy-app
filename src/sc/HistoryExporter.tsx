import { editLast } from "@/array";
import Checkbox from "@/components/Checkbox";
import ExportButton from "@/components/ExportButton";
import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { WordHistory } from "./WordHistory";

export default function HistoryExporter({
  histories,
  intermediateStageNames,
}: {
  histories: WordHistory[];
  intermediateStageNames: string[];
}) {
  const [exporting, setExporting] = useState(false);
  const [includeInputWords, setIncludeInputWords] = useState(true);
  const [includeStages, setIncludeStages] = useState(true);
  const [includeOutputWords, setIncludeOutputWords] = useState(true);

  const data = historiesToString(histories, {
    includeInputWords,
    includeOutputWords,
    intermediateStageNames: includeStages ? intermediateStageNames : [],
  });

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

export function historiesToString(
  histories: WordHistory[],
  options: {
    includeInputWords?: boolean;
    includeOutputWords?: boolean;
    intermediateStageNames?: string[];
  } = {}
): string {
  const rows = histories
    .map((history) => historyToRow(history, options))
    .filter((row) => row.length > 0);
  const lines = joinAllRowsWithArrows(rows);
  const result = lines.join("\n") + "\n";
  return result;
}

function historyToRow(
  history: WordHistory,
  options: {
    includeInputWords?: boolean;
    includeOutputWords?: boolean;
    intermediateStageNames?: string[];
  }
): (string | null)[] {
  const row = [];
  if (options.includeInputWords ?? true) {
    row.push(history.inputWord);
  }
  if (options.intermediateStageNames) {
    row.push(
      ...options.intermediateStageNames.map(
        (name) => history.intermediates.get(name) ?? null
      )
    );
  }
  if ((options.includeOutputWords ?? true) && history.outputWord) {
    row.push(history.outputWord);
  }
  return row;
}

function joinAllRowsWithArrows(rows: (string | null)[][]): string[] {
  if (rows.length === 0) {
    return [];
  }
  const padLengths: number[] = [];
  for (let i = 0; i < rows[0].length - 1; i++) {
    padLengths.push(Math.max(...rows.map((row) => row[i]?.length ?? 0)));
  }
  return rows.map((row) => joinRowWithArrows(row, padLengths));
}

function joinRowWithArrows(
  row: (string | null)[],
  padLengths: number[]
): string {
  const arrow = " => ";
  const stringsToJoin: string[] = [];
  row.forEach((word, i) => {
    if (padLengths[i]) {
      if (word) {
        stringsToJoin.push(
          padEndCompensatingForDiacritics(word, padLengths[i])
        );
      } else {
        editLast(stringsToJoin, (last) =>
          padEndCompensatingForDiacritics(last, arrow.length + padLengths[i])
        );
      }
    } else {
      stringsToJoin.push(word ?? "");
    }
  });
  return stringsToJoin.join(arrow);
}

function padEndCompensatingForDiacritics(s: string, padLength: number): string {
  const numberOfDiacritics = (s.match(/\p{Mn}/gu) ?? []).length;
  const padLengthCompensatingForDiacritics = padLength + numberOfDiacritics;
  return s.padEnd(padLengthCompensatingForDiacritics);
}
