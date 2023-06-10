import { set } from "@/array";
import Header from "@/components/Header";
import { entries, keys, toMap, values } from "@/map";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import * as Label from "@radix-ui/react-label";
import * as Switch from "@radix-ui/react-switch";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import Scv1Response from "./Scv1Response";
import { WordHistory } from "./WordHistory";

export default function ScPublic() {
  const [soundChanges, setSoundChanges] = useState("");
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [histories, setHistories] = useState<WordHistory[]>([
    { inputWord: "", outputWord: null, intermediates: new Map() },
  ]);
  const [showingStages, setShowingStages] = useState(true);
  const [tracing, setTracing] = useState(false);
  const [tracingEachWord, setTracingEachWord] = useState<boolean[]>([]);
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
            <table>
              <thead>
                <tr>
                  {tracing && <th>Trace</th>}
                  <th>Input Word</th>
                  <th></th>
                  {showingStages &&
                    intermediateStageNames.map((name) => (
                      <>
                        <th>{toNiceName(name)}</th>
                        <th></th>
                      </>
                    ))}
                  <th>Output Word</th>
                </tr>
              </thead>
              <tbody>
                {histories.map((history, i) => (
                  <tr key={i}>
                    {tracing && (
                      <td>
                        <Checkbox.Root
                          className="CheckboxRoot"
                          id={`tracing-${i}`}
                          checked={!!tracingEachWord[i]}
                          onCheckedChange={(checked) => {
                            setTracingEachWord(
                              set(tracingEachWord, i, checked === true)
                            );
                          }}
                        >
                          <Checkbox.Indicator className="CheckboxIndicator">
                            <CheckIcon />
                          </Checkbox.Indicator>
                        </Checkbox.Root>
                      </td>
                    )}
                    <td>
                      <input
                        type="text"
                        value={history.inputWord}
                        onChange={(event) =>
                          setInputWord(i, event.target.value)
                        }
                      />
                    </td>
                    <td>{history.outputWord && ">"}</td>
                    {showingStages &&
                      intermediateStageNames.map((name) => {
                        const intermediateWord =
                          history.intermediates.get(name);
                        return (
                          <>
                            <td>{intermediateWord}</td>
                            <td>{intermediateWord && ">"}</td>
                          </>
                        );
                      })}
                    <td>{history.outputWord}</td>
                  </tr>
                ))}
                {histories.at(-1)?.inputWord && (
                  <tr key={histories.length}>
                    <td>
                      <button onClick={addInputWord}>Add Word</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Label.Root htmlFor="show-stages">Show Stages</Label.Root>
            <Switch.Root
              className="SwitchRoot"
              id="show-stages"
              checked={showingStages}
              onCheckedChange={setShowingStages}
            >
              <Switch.Thumb className="SwitchThumb" />
            </Switch.Root>
            <Label.Root htmlFor="trace-changes">Trace Changes</Label.Root>
            <Switch.Root
              className="SwitchRoot"
              id="trace-changes"
              checked={tracing}
              onCheckedChange={setTracing}
            >
              <Switch.Thumb className="SwitchThumb" />
            </Switch.Root>
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
      { inputWord: "", outputWord: null, intermediates: new Map() },
    ]);
  }

  function setInputWord(i: number, word: string) {
    setHistories(set(histories, i, { ...histories[i], inputWord: word }));
  }

  function toNiceName(name: string) {
    return name
      .split("-")
      .map((word) => word.slice(0, 1).toLocaleUpperCase() + word.slice(1))
      .join(" ");
  }

  async function runSc() {
    const response = await axios.post<Scv1Response>("/api/scv1", {
      changes: soundChanges,
      inputWords: histories.map((history) => history.inputWord),
      traceWords: histories
        .filter((_, i) => tracingEachWord[i])
        .map((history) => history.inputWord),
    });
    const intermediateWords = toMap(response.data.intermediateWords ?? {});
    const traces = toMap(response.data.traces ?? {});
    setIntermediateStageNames(
      response.data.traces
        ? response.data.ruleNames.filter((ruleName) =>
            values(traces).some((trace) =>
              trace.some((step) => step.rule === ruleName)
            )
          )
        : keys(intermediateWords)
    );
    setHistories(
      histories.map((history, i) => ({
        ...history,
        outputWord: response.data.outputWords[i],
        intermediates: new Map(
          response.data.traces
            ? traces
                .get(history.inputWord)
                ?.map(({ rule, output }) => [rule, output])
            : entries(intermediateWords).map(([stage, words]) => [
                stage,
                words[i],
              ])
        ),
      }))
    );
  }
}
