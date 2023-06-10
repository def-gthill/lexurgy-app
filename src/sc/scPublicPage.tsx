import { set } from "@/array";
import Header from "@/components/Header";
import Switch from "@/components/Switch";
import { entries, hasElements, keys, toMap, values } from "@/map";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import HistoryTable from "./HistoryTable";
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
            onChange={(event) => setSoundChanges(event.target.value)}
            value={soundChanges}
          />
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

  async function runSc() {
    const response = await axios.post<Scv1Response>("/api/scv1", {
      changes: soundChanges,
      inputWords: histories.map((history) => history.inputWord),
      traceWords: tracing
        ? histories
            .filter((history) => history.tracing)
            .map((history) => history.inputWord)
        : [],
    });
    const intermediateWords = toMap(response.data.intermediateWords ?? {});
    const traces = toMap(response.data.traces ?? {});
    if (hasElements(traces)) {
      setIntermediateStageNames(
        response.data.ruleNames.filter((ruleName) =>
          values(traces).some((trace) =>
            trace.some((step) => step.rule === ruleName)
          )
        )
      );
      setHistories(
        histories.map((history, i) => ({
          ...history,
          outputWord: response.data.outputWords[i],
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
          outputWord: response.data.outputWords[i],
          intermediates: new Map(
            entries(intermediateWords).map(([stage, words]) => [
              stage,
              words[i],
            ])
          ),
        }))
      );
    }
  }
}
