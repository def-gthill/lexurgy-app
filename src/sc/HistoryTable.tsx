import Checkbox from "@/components/Checkbox";
import { Fragment } from "react";
import { WordHistory } from "./WordHistory";

export default function HistoryTable({
  intermediateStageNames,
  histories,
  showingStages,
  tracing,
  setInputWord,
  setTracing,
}: {
  intermediateStageNames: string[];
  histories: WordHistory[];
  showingStages: boolean;
  tracing: boolean;
  setInputWord: (index: number, word: string) => void;
  setTracing: (index: number, tracing: boolean) => void;
}) {
  return (
    <table>
      <thead>
        <tr>
          {tracing && <th>Trace</th>}
          <th>Input Word</th>
          <th></th>
          {showingStages &&
            intermediateStageNames.map((name) => (
              <Fragment key={name}>
                <th>{toNiceName(name)}</th>
                <th></th>
              </Fragment>
            ))}
          <th>Output Word</th>
        </tr>
      </thead>
      <tbody>
        {histories.map((history, i) => (
          <tr key={i}>
            {tracing && (
              <td>
                <Checkbox
                  id={`tracing-${i}`}
                  checked={history.tracing}
                  onCheckedChange={(checked) => {
                    setTracing(i, checked === true);
                  }}
                />
              </td>
            )}
            <td>
              <input
                type="text"
                value={history.inputWord}
                onChange={(event) => setInputWord(i, event.target.value)}
              />
            </td>
            <td>{history.outputWord && ">"}</td>
            {showingStages &&
              intermediateStageNames.map((name) => {
                const intermediateWord = history.intermediates.get(name);
                return (
                  <Fragment key={name}>
                    <td>{intermediateWord}</td>
                    <td>{intermediateWord && ">"}</td>
                  </Fragment>
                );
              })}
            <td>{history.outputWord}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function toNiceName(name: string) {
  return name
    .split("-")
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(" ");
}
