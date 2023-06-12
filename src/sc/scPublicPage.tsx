import Header from "@/components/Header";
import Select from "@/components/Select";
import SplitPane from "@/components/SplitPane";
import Switch from "@/components/Switch";
import { entries, hasElements, keys, toMap, values } from "@/map";
import useDebounced from "@/useDebounced";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import HistoryTable from "./HistoryTable";
import Scv1Request from "./Scv1Request";
import Scv1Response from "./Scv1Response";
import { WordHistory } from "./WordHistory";

export default function ScPublic() {
  const [soundChanges, setSoundChanges] = useState("");
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [histories, setHistories] = useState<WordHistory[]>([
    {
      inputWord: "",
      outputWord: null,
      intermediates: new Map(),
      tracing: false,
    },
  ]);
  const [tracing, setTracing] = useState(false);
  const [ruleNames, setRuleNames] = useState<string[]>([]);
  const [startAtEnabled, setStartAtEnabled] = useState(false);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [stopBeforeEnabled, setStopBeforeEnabled] = useState(false);
  const [stopBefore, setStopBefore] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestUpdatingRuleNames = useDebounced(updateRuleNames, 500);
  return (
    <>
      <Head>
        <title>Lexurgy Sound Changer</title>
        <meta
          name="description"
          content={`"A high-powered sound change applier"`}
        />
      </Head>
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
              <textarea
                id="sound-changes"
                style={{
                  display: "block",
                  width: "100%",
                  resize: "none",
                  height: "30rem",
                  whiteSpace: "pre",
                  wordWrap: "normal",
                }}
                onChange={(event) => {
                  setSoundChanges(event.target.value);
                  requestUpdatingRuleNames(event.target.value);
                }}
                value={soundChanges}
              />
              {error && <div id="error">{error}</div>}
            </div>
            <div>
              <HistoryTable
                intermediateStageNames={intermediateStageNames}
                histories={histories}
                tracing={tracing}
                setHistories={setHistories}
              />
              <div>
                <Switch
                  id="trace-changes"
                  checked={tracing}
                  onCheckedChange={setTracing}
                />
                <Label.Root htmlFor="trace-changes">Trace Changes</Label.Root>
              </div>
              <div>
                <Switch
                  id="start-at-enabled"
                  checked={startAtEnabled}
                  onCheckedChange={setStartAtEnabled}
                />
                <Label.Root htmlFor="start-at">Start At</Label.Root>
                <Select
                  id="start-at"
                  disabled={!startAtEnabled}
                  options={ruleNames.map((name) => ({
                    name: toNiceName(name),
                    value: name,
                  }))}
                  onChange={setStartAt}
                ></Select>
              </div>
              <div>
                <Switch
                  id="stop-before-enabled"
                  checked={stopBeforeEnabled}
                  onCheckedChange={setStopBeforeEnabled}
                />
                <Label.Root htmlFor="stop-before">Stop Before</Label.Root>
                <Select
                  id="stop-before"
                  disabled={!stopBeforeEnabled}
                  options={ruleNames.map((name) => ({
                    name: toNiceName(name),
                    value: name,
                  }))}
                  onChange={setStopBefore}
                ></Select>
              </div>
            </div>
          </SplitPane>
          <div className="buttons">
            <button onClick={runSc}>Apply</button>
          </div>
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
        setError(error.response.data.message);
      }
    }
  }

  async function runSc() {
    const request: Scv1Request = {
      changes: soundChanges,
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
        setError(error.response.data.message);
      }
    }
  }
}

function toNiceName(name: string) {
  return name
    .split("-")
    .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
    .join(" ");
}
