import { set } from "@/array";
import Checkbox from "@/components/Checkbox";
import LabelledSwitch from "@/components/LabelledSwitch";
import ScrollArea from "@/components/ScrollArea";
import styles from "@/sc/HistoryTable.module.css";
import { toNiceName } from "@/sc/ruleName";
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

  const inputColumnStyle = tracing
    ? styles.stickySecondColumnHeader
    : styles.stickyColumnHeader;

  return (
    <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", gap: "4px" }}>
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
                  height: "27rem",
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
          <div style={{ minWidth: 0, height: "28rem", flexGrow: 1 }}>
            <ScrollArea>
              <table style={{ borderSpacing: 0, textAlign: "left" }}>
                <thead>
                  <tr>
                    {tracing && (
                      <th
                        className={`${styles.stickyHeader} ${styles.stickyColumnHeader}`}
                      >
                        <div style={{ minWidth: "4em" }}>Trace</div>
                      </th>
                    )}
                    <th
                      className={`${styles.stickyHeader} ${inputColumnStyle}`}
                    >
                      Input Word
                    </th>
                    {showingStages &&
                      intermediateStageNames &&
                      intermediateStageNames.map((name) => (
                        <Fragment key={name}>
                          <th className={styles.stickyHeader}>
                            {toNiceName(name)}
                          </th>
                        </Fragment>
                      ))}
                    <th className={styles.stickyHeader}>Output Word</th>
                  </tr>
                </thead>
                <tbody>
                  {myHistories.map((history, i) => (
                    <tr key={i}>
                      {tracing && (
                        <td
                          className={`${styles.cell} ${styles.stickyColumnHeader}`}
                        >
                          <Checkbox
                            id={`tracing-${i}`}
                            checked={history.tracing}
                            onCheckedChange={(checked) => {
                              setTracingWord(i, checked === true);
                            }}
                          />
                        </td>
                      )}
                      <td className={`${styles.cell} ${inputColumnStyle}`}>
                        <b>{history.inputWord}</b>
                      </td>
                      {showingStages &&
                        intermediateStageNames &&
                        intermediateStageNames.map((name) => {
                          const intermediateWord =
                            history.intermediates.get(name);
                          return (
                            <td className={styles.cell} key={name}>
                              {intermediateWord}
                            </td>
                          );
                        })}
                      <td className={styles.cell}>{history.outputWord}</td>
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

  function setTracingWord(i: number, tracing: boolean) {
    mySetHistories(set(myHistories, i, { ...myHistories[i], tracing }));
  }
}
