import { editLast } from "@/array";
import ExportButton from "@/components/ExportButton";
import LabelledCheckbox from "@/components/LabelledCheckbox";
import styles from "@/sc/HistoryExporter.module.css";
import * as Label from "@radix-ui/react-label";
import copy from "copy-to-clipboard";
import { useState } from "react";
import { WordHistory } from "./WordHistory";

export default function HistoryExporter({
  histories,
  intermediateStageNames,
  onDone,
}: {
  histories: WordHistory[];
  intermediateStageNames: string[];
  onDone: () => void;
}) {
  const [includeInputWords, setIncludeInputWords] = useState(true);
  const [includeStages, setIncludeStages] = useState(true);
  const [includeOutputWords, setIncludeOutputWords] = useState(true);

  const data = historiesToString(histories, {
    includeInputWords,
    includeOutputWords,
    intermediateStageNames: includeStages ? intermediateStageNames : [],
  });

  return (
    <div className={styles.root}>
      <div className={styles.previewPanel}>
        <Label.Root htmlFor="preview" style={{ fontWeight: "bold" }}>
          Export Histories
        </Label.Root>
        <div className={styles.previewContainer}>
          <textarea
            readOnly
            value={data}
            id="preview"
            className={`export-preview ${styles.exportPreview}`}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <LabelledCheckbox
          id="include-input-words"
          label="Input Words"
          checked={includeInputWords}
          onCheckedChange={setIncludeInputWords}
        />
        <LabelledCheckbox
          id="include-stages"
          label="Stages"
          checked={includeStages}
          onCheckedChange={setIncludeStages}
        />
        <LabelledCheckbox
          id="include-output-words"
          label="Output Words"
          checked={includeOutputWords}
          onCheckedChange={setIncludeOutputWords}
        />
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            copy(data);
            alert("Copied to clipboard!");
          }}
        >
          Copy
        </button>
        <ExportButton label="Download" fileName="lexurgy.wli" data={data} />
        <button onClick={onDone}>Done</button>
      </div>
    </div>
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
