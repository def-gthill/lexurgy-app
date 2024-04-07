import { set } from "@/array";
import Checkbox from "@/components/Checkbox";
import LabelledSwitch from "@/components/LabelledSwitch";
import ScrollArea from "@/components/ScrollArea";
import useWeakState from "@/useWeakState";
import * as Label from "@radix-ui/react-label";
import { Fragment, useState } from "react";
import { WordHistory, emptyHistory } from "./WordHistory";

export default function HistoryTable({
  intermediateStageNames,
  histories,
  tracing,
  setHistories,
}: {
  intermediateStageNames?: string[];
  histories: WordHistory[];
  tracing?: boolean;
  setHistories: (histories: WordHistory[]) => void;
}) {
  const [editingInputs, setEditingInputs] = useState(true);
  const [showingStages, setShowingStages] = useState(true);
  const [myHistories, mySetHistories] = useWeakState(histories, setHistories);

  return (
    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex" }}>
          {editingInputs && (
            <div>
              <Label.Root htmlFor="input-words" style={{ fontWeight: "bold" }}>
                Input Words
              </Label.Root>
              <textarea
                id="input-words"
                style={{
                  display: "block",
                  width: "10rem",
                  resize: "none",
                  height: "25rem",
                  whiteSpace: "pre",
                  wordWrap: "normal",
                }}
                onChange={(event) => {
                  const inputWords = event.target.value.split(/\r?\n/);
                  mySetHistories(inputWords.map(emptyHistory));
                }}
                value={myHistories
                  .map((history) => history.inputWord)
                  .join("\n")}
              />
            </div>
          )}
          <div style={{ display: "flex", maxHeight: "25rem" }}>
            <ScrollArea>
              <table>
                <thead>
                  <tr>
                    {tracing && <th>Trace</th>}
                    <th>Input Word</th>
                    <th></th>
                    {showingStages &&
                      intermediateStageNames &&
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
                  {myHistories.map((history, i) => (
                    <tr key={i}>
                      {tracing && (
                        <td>
                          <Checkbox
                            id={`tracing-${i}`}
                            checked={history.tracing}
                            onCheckedChange={(checked) => {
                              setTracingWord(i, checked === true);
                            }}
                          />
                        </td>
                      )}
                      <td>
                        <input
                          type="text"
                          value={history.inputWord}
                          onChange={(event) =>
                            setInputWord(i, event.target.value)
                          }
                        />
                      </td>
                      <td>{history.outputWord && ">"}</td>
                      {showingStages &&
                        intermediateStageNames &&
                        intermediateStageNames.map((name) => {
                          const intermediateWord =
                            history.intermediates.get(name);
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
            </ScrollArea>
          </div>
        </div>
      </div>
      <LabelledSwitch
        id="free-edit"
        label="Edit Inputs"
        checked={editingInputs}
        onCheckedChange={setEditingInputs}
      />
      <LabelledSwitch
        id="show-stages"
        label="Show Stages"
        checked={showingStages}
        onCheckedChange={setShowingStages}
      />
    </div>
  );

  function setInputWord(i: number, word: string) {
    mySetHistories(set(myHistories, i, { ...myHistories[i], inputWord: word }));
  }

  function setTracingWord(i: number, tracing: boolean) {
    mySetHistories(set(myHistories, i, { ...myHistories[i], tracing }));
  }
}

function toNiceName(name: string) {
  return name
    .split("-")
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(" ");
}
