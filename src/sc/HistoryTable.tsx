import { set } from "@/array";
import Checkbox from "@/components/Checkbox";
import ScrollArea from "@/components/ScrollArea";
import Switch from "@/components/Switch";
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
  const [freeEditing, setFreeEditing] = useState(false);
  const [showingStages, setShowingStages] = useState(true);
  const [myHistories, mySetHistories] = useWeakState(histories, setHistories);

  return (
    <div>
      <Switch
        id="free-edit"
        checked={freeEditing}
        onCheckedChange={setFreeEditing}
      />
      <Label.Root htmlFor="free-edit">Edit Input List</Label.Root>
      {freeEditing ? (
        <div>
          <Label.Root htmlFor="input-words" style={{ fontWeight: "bold" }}>
            Input Words
          </Label.Root>
          <textarea
            id="input-words"
            style={{
              display: "block",
              width: "100%",
              resize: "none",
              height: "10rem",
              whiteSpace: "pre",
              wordWrap: "normal",
            }}
            onChange={(event) => {
              const inputWords = event.target.value.split(/[\r\n]+/);
              mySetHistories(inputWords.map(emptyHistory));
            }}
            value={myHistories.map((history) => history.inputWord).join("\n")}
          />
        </div>
      ) : (
        <div>
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
          {myHistories.at(-1)?.inputWord && (
            <div className="buttons">
              <button onClick={addInputWord}>Add Word</button>
            </div>
          )}
        </div>
      )}
      <Switch
        id="show-stages"
        checked={showingStages}
        onCheckedChange={setShowingStages}
      />
      <Label.Root htmlFor="show-stages">Show Stages</Label.Root>
    </div>
  );

  function addInputWord() {
    mySetHistories([
      ...myHistories,
      {
        inputWord: "",
        outputWord: null,
        intermediates: new Map(),
        tracing: false,
      },
    ]);
  }

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
