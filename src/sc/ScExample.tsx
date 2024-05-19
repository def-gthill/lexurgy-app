import CodeEditor from "@/components/CodeEditor";
import SplitPane from "@/components/SplitPane";
import { entries, hasElements, keys, toMap, values } from "@/map";
import HistoryTable from "@/sc/HistoryTable";
import { RuntimeError } from "@/sc/RuntimeError";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import useScCaching from "@/sc/useScCaching";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import { useState } from "react";

export default function ScExample({
  changes,
  inputs,
}: {
  changes: string;
  inputs: string[];
}) {
  const [soundChanges, setSoundChanges] = useState(changes);
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [histories, setHistories] = useState<WordHistory[]>(
    inputs.map(emptyHistory)
  );
  const [runtimeErrors, setRuntimeErrors] = useState<RuntimeError[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [scRunToggle, setScRunToggle] = useState(0);

  const runScWithCaching = useScCaching(runSoundChanges);

  const heightInRem = 1.5 * changes.split("\n").length;

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
              initialCode={soundChanges}
              onUpdateCode={setSoundChanges}
              height={`${heightInRem}rem`}
            />
            <div id="status">{error ?? status}</div>
          </div>
        </div>
        <HistoryTable
          key={scRunToggle}
          intermediateStageNames={intermediateStageNames}
          histories={histories}
          errors={runtimeErrors}
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
          <button onClick={runSc}>Apply</button>
        </div>
      </div>
    </div>
  );

  async function runSc() {
    setStatus("Running...");
    const request: Scv1Request = {
      changes: soundChanges,
      inputWords: inputs,
      traceWords: [],
      startAt: null,
      stopBefore: null,
    };
    try {
      const result = await runScWithCaching(request);
      const intermediateWords = toMap(result.intermediateWords ?? {});
      const traces = toMap(result.traces ?? {});
      const errors = result.errors ?? [];
      setError(null);
      setScRunToggle(1 - scRunToggle);
      setRuntimeErrors(errors);
      if (hasElements(traces)) {
        setIntermediateStageNames(
          result.ruleNames.filter((ruleName) =>
            values(traces).some((trace) =>
              trace.some((step) => step.rule === ruleName)
            )
          )
        );
        setHistories(
          histories.map((history, i) => ({
            ...history,
            outputWord: result.outputWords[i],
            intermediates: new Map(
              traces
                .get(history.inputWord)
                ?.map(({ rule, output }) => [rule, output])
            ),
          }))
        );
      } else {
        setIntermediateStageNames(keys(intermediateWords));
        setHistories(
          histories.map((history, i) => ({
            ...history,
            outputWord: result.outputWords[i],
            intermediates: new Map(
              entries(intermediateWords).map(([stage, words]) => [
                stage,
                words[i],
              ])
            ),
          }))
        );
      }
    } catch (error: any) {
      if (error.response) {
        setError(toErrorMessage(error.response.data));
      }
    } finally {
      setStatus("Ready");
    }
  }
}

async function runSoundChanges(inputs: Scv1Request): Promise<Scv1Response> {
  const response = await axios.post<Scv1Response>("/api/services", inputs, {
    params: { endpoint: "scv1" },
  });
  return response.data;
}

function toErrorMessage(error: any) {
  let message = error.message;
  if (error.lineNumber) {
    message += ` (line ${error.lineNumber})`;
  }
  return message;
}
