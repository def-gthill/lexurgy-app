import CodeEditor from "@/components/CodeEditor";
import ExportButton from "@/components/ExportButton";
import ImportButton from "@/components/ImportButton";
import LabelledSwitch from "@/components/LabelledSwitch";
import Select from "@/components/Select";
import SplitPane from "@/components/SplitPane";
import { entries, hasElements, keys, toMap, values } from "@/map";
import Evolution from "@/sc/Evolution";
import HistoryExporter from "@/sc/HistoryExporter";
import HistoryTable from "@/sc/HistoryTable";
import { RuntimeError } from "@/sc/RuntimeError";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import ShareButton from "@/sc/ShareButton";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import { toNiceName } from "@/sc/ruleName";
import useScCaching from "@/sc/useScCaching";
import useDebounced from "@/useDebounced";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import { ReactElement, useEffect, useState } from "react";

export default function ScRunner({
  baseUrl,
  evolution,
  onUpdate,
  importButton = defaultImportButton,
  getRuleNames = defaultGetRuleNames,
  runSoundChanges = defaultRunSoundChanges,
}: {
  baseUrl: string | null;
  evolution: Evolution;
  onUpdate?: (evolution: Evolution) => void;
  importButton?: (
    ariaLabel: string,
    expectedFileType: string,
    sendData: (data: string) => void
  ) => ReactElement;
  getRuleNames?: (changes: string) => Promise<string[]>;
  runSoundChanges?: (inputs: Scv1Request) => Promise<Scv1Response>;
}) {
  const [initialSoundChanges, setInitialSoundChanges] = useState(
    evolution.soundChanges
  );
  const [editedSoundChanges, setEditedSoundChanges] = useState(
    evolution.soundChanges
  );
  useEffect(() => {
    setInitialSoundChanges(evolution.soundChanges);
    setEditedSoundChanges(evolution.soundChanges);
  }, [evolution.soundChanges]);
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [histories, setHistories] = useState<WordHistory[]>(
    evolution.testWords.map(emptyHistory)
  );
  useEffect(() => {
    setHistories(evolution.testWords.map(emptyHistory));
  }, [evolution.testWords]);
  const [runtimeErrors, setRuntimeErrors] = useState<RuntimeError[]>([]);

  const [exporting, setExporting] = useState(false);

  const testWords = histories.map((history) => history.inputWord);
  const [tracing, setTracing] = useState(false);
  const [ruleNames, setRuleNames] = useState<string[]>([]);
  const [startAtEnabled, setStartAtEnabled] = useState(false);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [stopBeforeEnabled, setStopBeforeEnabled] = useState(false);
  const [stopBefore, setStopBefore] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [scRunToggle, setScRunToggle] = useState(0);

  const sendEvolution = useDebounced(updateEvolution, 500);
  const requestUpdatingRuleNames = useDebounced(updateRuleNames, 500);
  const runScWithCaching = useScCaching(runSoundChanges);

  const selectableRules = ruleNames
    .filter((name) => !name.startsWith("<"))
    .map((name) => ({
      name: toNiceName(name),
      value: name,
    }));

  return (
    <div className="card">
      <SplitPane>
        <div
          style={{
            height: "38rem",
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
              initialCode={initialSoundChanges}
              onUpdateCode={onEditSoundChanges}
              height="27rem"
            />
            <div id="status">{error ?? status}</div>
          </div>
          <div className="buttons">
            {importButton(
              "Import Sound Changes",
              ".lsc",
              (soundChanges: string) => {
                setInitialSoundChanges(soundChanges);
                onEditSoundChanges(soundChanges);
              }
            )}
            <ExportButton fileName="lexurgy.lsc" data={editedSoundChanges} />
            <a
              href="https://www.meamoria.com/lexurgy/html/sc-tutorial.html"
              target="_blank"
              rel="noopener"
              className="button"
            >
              Help
            </a>
            <a className="button" href="/sc/examples" target="_blank">
              Examples
            </a>
          </div>
        </div>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {exporting ? (
            <HistoryExporter
              histories={histories}
              intermediateStageNames={intermediateStageNames}
              onDone={() => setExporting(false)}
            />
          ) : (
            <div
              style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <HistoryTable
                key={scRunToggle}
                intermediateStageNames={intermediateStageNames}
                histories={histories}
                tracing={tracing}
                errors={runtimeErrors}
                setHistories={onEditHistories}
              />
              <div className="buttons">
                {importButton("Import Input Words", ".wli", (data) => {
                  const inputWords = data.split(/[\r\n]+/);
                  onEditHistories(inputWords.map(emptyHistory));
                })}
                <button onClick={() => setExporting(true)}>Export</button>
              </div>
            </div>
          )}
        </div>
      </SplitPane>
      <hr />
      <div
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "50%",
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <div className="buttons">
            <button onClick={runSc} className="big-button">
              Apply
            </button>
            <ShareButton
              baseUrl={baseUrl}
              soundChanges={editedSoundChanges}
              inputWords={testWords}
            />
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "max-content max-content",
            }}
          >
            <LabelledSwitch
              id="trace-changes"
              label="Trace Changes"
              checked={tracing}
              onCheckedChange={setTracing}
            />
            <div />
            <LabelledSwitch
              id="start-at-enabled"
              label="Start At Rule"
              checked={startAtEnabled}
              onCheckedChange={setStartAtEnabled}
            />
            <Select
              id="start-at"
              ariaLabel="Choose Rule to Start At"
              disabled={!startAtEnabled}
              options={selectableRules}
              currentSelection={startAt ?? undefined}
              onChange={setStartAt}
            ></Select>
            <LabelledSwitch
              id="stop-before-enabled"
              label="Stop Before Rule"
              checked={stopBeforeEnabled}
              onCheckedChange={setStopBeforeEnabled}
            />
            <Select
              id="stop-before"
              ariaLabel="Choose Rule to Stop Before"
              disabled={!stopBeforeEnabled}
              options={selectableRules}
              currentSelection={stopBefore ?? undefined}
              onChange={setStopBefore}
            ></Select>
          </div>
        </div>
      </div>
    </div>
  );

  function onEditSoundChanges(newSoundChanges: string) {
    setEditedSoundChanges(newSoundChanges);
    sendEvolution({
      soundChanges: newSoundChanges,
      testWords,
    });
    requestUpdatingRuleNames(newSoundChanges);
  }

  function onEditHistories(newHistories: WordHistory[]) {
    setHistories(newHistories);
    sendEvolution({
      soundChanges: editedSoundChanges,
      testWords: newHistories.map((history) => history.inputWord),
    });
  }

  function updateEvolution(newEvolution: Evolution) {
    if (onUpdate) {
      onUpdate(newEvolution);
    }
  }

  async function updateRuleNames(soundChanges: string) {
    try {
      const ruleNames = await getRuleNames(soundChanges);
      setError(null);
      setRuleNames(ruleNames);
    } catch (error: any) {
      if (error.response) {
        setError(toErrorMessage(error.response.data));
      }
    }
  }

  async function runSc() {
    setStatus("Running...");
    const request: Scv1Request = {
      changes: editedSoundChanges,
      inputWords: testWords,
      traceWords: tracing
        ? histories
            .filter((history) => history.tracing)
            .map((history) => history.inputWord)
        : [],
      startAt: startAtEnabled ? startAt : null,
      stopBefore: stopBeforeEnabled ? stopBefore : null,
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

function defaultImportButton(
  ariaLabel: string,
  expectedFileType: string,
  sendData: (data: string) => void
) {
  return (
    <ImportButton
      ariaLabel={ariaLabel}
      expectedFileType={expectedFileType}
      sendData={sendData}
    />
  );
}

async function defaultGetRuleNames(changes: string): Promise<string[]> {
  const response = await axios.post<{ ruleNames: string[] }>(
    "/api/services",
    { changes },
    { params: { endpoint: "scv1/validate" } }
  );
  return response.data.ruleNames;
}

async function defaultRunSoundChanges(
  inputs: Scv1Request
): Promise<Scv1Response> {
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
