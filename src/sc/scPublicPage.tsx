import { set } from "@/array";
import Header from "@/components/Header";
import Select from "@/components/Select";
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
  const [showingStages, setShowingStages] = useState(true);
  const [tracing, setTracing] = useState(false);
  const [ruleNames, setRuleNames] = useState<string[]>([]);
  const [startAt, setStartAt] = useState<string | null>(null);
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
          <Label.Root htmlFor="sound-changes">Sound Changes</Label.Root>
          <textarea
            id="sound-changes"
            onChange={(event) => {
              setSoundChanges(event.target.value);
              requestUpdatingRuleNames(event.target.value);
            }}
            value={soundChanges}
          />
          {error && <div id="error">{error}</div>}
          <div>
            <HistoryTable
              intermediateStageNames={intermediateStageNames}
              histories={histories}
              showingStages={showingStages}
              tracing={tracing}
              setInputWord={setInputWord}
              setTracing={setTracingWord}
            />
            {histories.at(-1)?.inputWord && (
              <div className="buttons">
                <button onClick={addInputWord}>Add Word</button>
              </div>
            )}
            <Label.Root htmlFor="show-stages">Show Stages</Label.Root>
            <Switch
              id="show-stages"
              checked={showingStages}
              onCheckedChange={setShowingStages}
            />
            <Label.Root htmlFor="trace-changes">Trace Changes</Label.Root>
            <Switch
              id="trace-changes"
              checked={tracing}
              onCheckedChange={setTracing}
            />
            <Label.Root htmlFor="start-at">Start At</Label.Root>
            <Select
              id="start-at"
              options={ruleNames.map((name) => ({
                name: toNiceName(name),
                value: name,
              }))}
              onChange={setStartAt}
            ></Select>
            <Label.Root htmlFor="stop-before">Stop Before</Label.Root>
            <Select
              id="stop-before"
              options={ruleNames.map((name) => ({
                name: toNiceName(name),
                value: name,
              }))}
              onChange={setStopBefore}
            ></Select>
          </div>
          <div className="buttons">
            <button onClick={runSc}>Apply</button>
          </div>
        </div>
      </main>
    </>
  );

  function addInputWord() {
    setHistories([
      ...histories,
      {
        inputWord: "",
        outputWord: null,
        intermediates: new Map(),
        tracing: false,
      },
    ]);
  }

  function setInputWord(i: number, word: string) {
    setHistories(set(histories, i, { ...histories[i], inputWord: word }));
  }

  function setTracingWord(i: number, tracing: boolean) {
    setHistories(set(histories, i, { ...histories[i], tracing }));
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
      startAt,
      stopBefore,
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
