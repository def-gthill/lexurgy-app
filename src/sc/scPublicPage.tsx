import CodeEditor from "@/components/CodeEditor";
import ExportButton from "@/components/ExportButton";
import Header from "@/components/Header";
import ImportButton from "@/components/ImportButton";
import LabelledSwitch from "@/components/LabelledSwitch";
import PageInfo from "@/components/PageInfo";
import Select from "@/components/Select";
import SplitPane from "@/components/SplitPane";
import { entries, hasElements, keys, toMap, values } from "@/map";
import HistoryExporter from "@/sc/HistoryExporter";
import HistoryTable from "@/sc/HistoryTable";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import { WordHistory, emptyHistory } from "@/sc/WordHistory";
import useDebounced from "@/useDebounced";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import copy from "copy-to-clipboard";
import { decode, encode } from "js-base64";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ScPublic({ baseUrl }: { baseUrl: string | null }) {
  let soundChangesFromUrl = "";
  let historiesFromUrl = [emptyHistory()];
  const router = useRouter();
  if (router.isReady) {
    const changes = router.query.changes;
    const input = router.query.input;

    if (typeof input === "string") {
      historiesFromUrl = decode(input).split("\n").map(emptyHistory);
    }
    if (typeof changes === "string") {
      soundChangesFromUrl = decode(changes);
    }
  }

  const [initialSoundChanges, setInitialSoundChanges] =
    useState(soundChangesFromUrl);
  const [editedSoundChanges, setEditedSoundChanges] =
    useState(soundChangesFromUrl);
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [histories, setHistories] = useState<WordHistory[]>(historiesFromUrl);
  const [tracing, setTracing] = useState(false);
  const [ruleNames, setRuleNames] = useState<string[]>([]);
  const [startAtEnabled, setStartAtEnabled] = useState(false);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [stopBeforeEnabled, setStopBeforeEnabled] = useState(false);
  const [stopBefore, setStopBefore] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Ready");
  const [scRunToggle, setScRunToggle] = useState(0);
  const requestUpdatingRuleNames = useDebounced(updateRuleNames, 500);

  return (
    <>
      <PageInfo
        title="Lexurgy Sound Changer"
        description="A high-powered sound change applier"
      />
      <Header />
      <main>
        <div className="card">
          <SplitPane>
            <div>
              <Label.Root
                htmlFor="sound-changes"
                style={{ fontWeight: "bold" }}
              >
                Sound Changes
              </Label.Root>
              <CodeEditor
                initialCode={initialSoundChanges}
                onUpdateCode={(newSoundChanges) => {
                  setEditedSoundChanges(newSoundChanges);
                  requestUpdatingRuleNames(newSoundChanges);
                }}
                height="30rem"
              />
              <div id="status">{error ?? status}</div>
              <div className="buttons">
                <ImportButton
                  expectedFileType=".lsc"
                  sendData={(data) => {
                    setInitialSoundChanges(data);
                    requestUpdatingRuleNames(data);
                  }}
                />
                <ExportButton
                  fileName="lexurgy.lsc"
                  data={editedSoundChanges}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <HistoryTable
                  key={scRunToggle}
                  intermediateStageNames={intermediateStageNames}
                  histories={histories}
                  tracing={tracing}
                  setHistories={setHistories}
                />
                <div className="buttons">
                  <ImportButton
                    expectedFileType=".wli"
                    sendData={(data) => {
                      const inputWords = data.split(/[\r\n]+/);
                      setHistories(inputWords.map(emptyHistory));
                    }}
                  />
                  <HistoryExporter
                    histories={histories}
                    intermediateStageNames={intermediateStageNames}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="buttons">
                  <button
                    onClick={runSc}
                    style={{
                      fontSize: "2em",
                      padding: "20px",
                      borderRadius: "10px",
                    }}
                  >
                    Apply
                  </button>
                  <ShareButton
                    baseUrl={baseUrl}
                    soundChanges={editedSoundChanges}
                    inputWords={histories.map((history) => history.inputWord)}
                  />
                </div>
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
          </SplitPane>
        </div>
      </main>
    </>
  );

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
      inputWords: histories.map((history) => history.inputWord),
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

function ShareButton({
  baseUrl,
  soundChanges,
  inputWords,
}: {
  baseUrl: string | null;
  soundChanges: string;
  inputWords: string[];
}) {
  return <button onClick={share}>Share</button>;

  function share() {
    const inputWordsEncoded = encode(inputWords.join("\n"), true);
    const soundChangesEncoded = encode(soundChanges, true);
    const url = `${
      baseUrl ?? "www.lexurgy.com"
    }/sc?changes=${soundChangesEncoded}&input=${inputWordsEncoded}`;
    copy(url);
    alert("Link copied to clipboard!");
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
