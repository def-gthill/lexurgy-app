import Checkbox from "@/components/Checkbox";
import Switch from "@/components/Switch";
import * as Label from "@radix-ui/react-label";
import { Fragment, useState } from "react";
import { WordHistory } from "./WordHistory";

export default function HistoryTable({
  intermediateStageNames,
  histories,
  tracing,
  setInputWord,
  setTracing,
}: {
  intermediateStageNames: string[];
  histories: WordHistory[];
  tracing: boolean;
  setInputWord: (index: number, word: string) => void;
  setTracing: (index: number, tracing: boolean) => void;
}) {
  const [showingStages, setShowingStages] = useState(true);
  return (
    <div>
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
      <Switch
        id="show-stages"
        checked={showingStages}
        onCheckedChange={setShowingStages}
      />
      <Label.Root htmlFor="show-stages">Show Stages</Label.Root>
    </div>
  );
}

function toNiceName(name: string) {
  return name
    .split("-")
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(" ");
}
