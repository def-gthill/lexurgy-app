import { set } from "@/array";
import Checkbox from "@/components/Checkbox";
import LabelledSwitch from "@/components/LabelledSwitch";
import ScrollArea from "@/components/ScrollArea";
import styles from "@/sc/HistoryTable.module.css";
import { RuntimeError } from "@/sc/RuntimeError";
import { toNiceName } from "@/sc/ruleName";
import useWeakState from "@/useWeakState";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import * as Popover from "@radix-ui/react-popover";
import { Fragment, useState } from "react";
import { WordHistory, emptyHistory } from "./WordHistory";

export default function HistoryTable({
  intermediateStageNames,
  histories,
  tracing,
  errors,
  setHistories,
}: {
  intermediateStageNames?: string[];
  histories: WordHistory[];
  tracing?: boolean;
  errors?: RuntimeError[];
  setHistories: (histories: WordHistory[]) => void;
}) {
  const [editingInputs, setEditingInputs] = useState(true);
  const [showingStages, setShowingStages] = useState(true);
  const [myHistories, mySetHistories] = useWeakState(histories, setHistories);
  const [tableRef, setTableRef] = useState<HTMLElement | null>(null);

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
          <div
            ref={setTableRef}
            style={{ minWidth: 0, height: "28rem", flexGrow: 1 }}
          >
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
                            ariaLabel="Trace"
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
                            history.intermediates.get(name) ?? "";
                          return (
                            <td className={styles.cell} key={name}>
                              {outputCell(history.inputWord, intermediateWord)}
                            </td>
                          );
                        })}
                      <td className={styles.cell}>
                        {outputCell(
                          history.inputWord,
                          history.outputWord ?? ""
                        )}
                      </td>
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

  function outputCell(inputWord: string, outputWord: string) {
    if (outputWord === "ERROR") {
      const error = errors?.find((error) => error.originalWord === inputWord);
      if (!error) {
        return "ERROR";
      }
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            width: "max-content",
          }}
        >
          <div>ERROR</div>

          <Popover.Root>
            <Popover.Trigger asChild>
              <button aria-label="Error Details" style={{ flexShrink: 0 }}>
                <QuestionMarkCircledIcon />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className={styles.errorPopover}
                sideOffset={5}
                onFocusOutside={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
                avoidCollisions
                collisionBoundary={tableRef}
              >
                <div>{error.message}</div>
                <Popover.Close>
                  <button>Done</button>
                </Popover.Close>
                <Popover.Arrow />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      );
    } else {
      return outputWord;
    }
  }
}
