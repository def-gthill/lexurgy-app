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
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import ShareButton from "@/sc/ShareButton";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import useDebounced from "@/useDebounced";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ScRunner({
  baseUrl,
  evolution,
  onUpdate,
}: {
  baseUrl: string | null;
  evolution: Evolution;
  onUpdate?: (evolution: Evolution) => void;
}) {
  const [editedSoundChanges, setEditedSoundChanges] = useState(
    evolution.soundChanges
  );
  useEffect(() => {
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

  return (
    <div className="card">
      <SplitPane>
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Label.Root htmlFor="sound-changes" style={{ fontWeight: "bold" }}>
              Sound Changes
            </Label.Root>
            <CodeEditor
              initialCode={evolution.soundChanges}
              onUpdateCode={onEditSoundChanges}
              height="30rem"
            />
            <div id="status">{error ?? status}</div>
          </div>
          <div className="buttons">
            <ImportButton
              expectedFileType=".lsc"
              sendData={onEditSoundChanges}
            />
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
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
          >
            <HistoryTable
              key={scRunToggle}
              intermediateStageNames={intermediateStageNames}
              histories={histories}
              tracing={tracing}
              setHistories={onEditHistories}
            />
            <div className="buttons">
              <ImportButton
                expectedFileType=".wli"
                sendData={(data) => {
                  const inputWords = data.split(/[\r\n]+/);
                  onEditHistories(inputWords.map(emptyHistory));
                }}
              />
              <HistoryExporter
                histories={histories}
                intermediateStageNames={intermediateStageNames}
              />
            </div>
          </div>
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
              disabled={!startAtEnabled}
              options={ruleNames.map((name) => ({
                name: toNiceName(name),
                value: name,
              }))}
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
              disabled={!stopBeforeEnabled}
              options={ruleNames.map((name) => ({
                name: toNiceName(name),
                value: name,
              }))}
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
      const response = await axios.post<{ ruleNames: string[] }>(
        "/api/services",
        {
          changes: soundChanges,
        },
        {
          params: {
            endpoint: "scv1/validate",
          },
        }
      );
      setError(null);
      setRuleNames(response.data.ruleNames);
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
      const response = await axios.post<Scv1Response>(
        "/api/services",
        request,
        {
          params: { endpoint: "scv1" },
        }
      );
      const result = response.data;
      const intermediateWords = toMap(result.intermediateWords ?? {});
      const traces = toMap(result.traces ?? {});
      setError(null);
      setScRunToggle(1 - scRunToggle);
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

function toNiceName(name: string) {
  return name
    .split("-")
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(" ");
}

function toErrorMessage(error: any) {
  let message = error.message;
  if (error.lineNumber) {
    message += ` (line ${error.lineNumber})`;
  }
  return message;
}
