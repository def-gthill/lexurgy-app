import { set } from "@/array";
import Header from "@/components/Header";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import Scv1Response from "./Scv1Response";
import { WordHistory } from "./WordHistory";

export default function ScPublic() {
  const [soundChanges, setSoundChanges] = useState("");
  const [histories, setHistories] = useState<WordHistory[]>([
    { inputWord: "", outputWord: null, intermediates: new Map() },
  ]);
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
                  <th>Input Word</th>
                  <th></th>
                  <th>Output Word</th>
                </tr>
              </thead>
              <tbody>
                {histories.map((history, i) => (
                  <tr key={i}>
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

  async function runSc() {
    const response = await axios.post<Scv1Response>("/api/scv1", {
      changes: soundChanges,
      inputWords: histories.map((history) => history.inputWord),
    });
    setHistories(
      histories.map((history, i) => ({
        ...history,
        outputWord: response.data.outputWords[i],
      }))
    );
  }
}
