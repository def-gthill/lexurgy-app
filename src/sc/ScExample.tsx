import CodeEditor from "@/components/CodeEditor";
import SplitPane from "@/components/SplitPane";
import HistoryTable from "@/sc/HistoryTable";
import { emptyHistory } from "@/sc/WordHistory";
import { getRuleNames, runSoundChanges } from "@/sc/api";
import useScState from "@/sc/useScState";
import * as Label from "@radix-ui/react-label";
import { useEffect } from "react";

export default function ScExample({
  changes,
  inputs,
}: {
  changes: string;
  inputs: string[];
}) {
  const sc = useScState(getRuleNames, runSoundChanges);
  const setSoundChanges = sc.setSoundChanges;
  const setHistories = sc.setHistories;

  useEffect(() => {
    setSoundChanges(changes);
  }, [changes, setSoundChanges]);
  useEffect(() => {
    setHistories(inputs.map(emptyHistory));
  }, [inputs, setHistories]);

  const changeLines = changes.split("\n").length;
  const heightInRem = Math.max(
    1.4 * (changeLines + 1.5),
    1.5 * (inputs.length + 1)
  );

  return (
    <div className="card">
      <SplitPane>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Label.Root style={{ fontWeight: "bold" }}>
              Sound Changes
            </Label.Root>
            <CodeEditor
              initialCode={changes}
              onUpdateCode={onEditSoundChanges}
              height={`${heightInRem}rem`}
            />
            <div id="status">{sc.error ?? sc.status}</div>
          </div>
        </div>
        <HistoryTable
          key={sc.scRunToggle}
          intermediateStageNames={sc.intermediateStageNames}
          histories={sc.histories}
          errors={sc.runtimeErrors}
          setHistories={setHistories}
          showSwitches={false}
          heightInRem={heightInRem}
        />
      </SplitPane>
      <hr />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="buttons">
          <button onClick={sc.runSc}>Apply</button>
        </div>
      </div>
    </div>
  );

  function onEditSoundChanges(newSoundChanges: string) {
    sc.setSoundChanges(newSoundChanges);
    sc.requestValidation(newSoundChanges);
  }
}
