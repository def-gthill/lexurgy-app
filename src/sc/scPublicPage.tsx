import Header from "@/components/Header";
import * as Label from "@radix-ui/react-label";
import axios from "axios";
import Head from "next/head";
import { useState } from "react";
import Scv1Response from "./Scv1Response";

export default function ScPublic() {
  const [inputWords, setInputWords] = useState("");
  const [soundChanges, setSoundChanges] = useState("");
  const [outputDisplay, setOutputDisplay] = useState("");
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
          <Label.Root htmlFor="input-words">Input Words</Label.Root>
          <textarea
            id="input-words"
            onChange={(event) => setInputWords(event.target.value)}
            value={inputWords}
          />
          <Label.Root htmlFor="sound-changes">Sound Changes</Label.Root>
          <textarea
            id="sound-changes"
            onChange={(event) => setSoundChanges(event.target.value)}
            value={soundChanges}
          />
          <Label.Root htmlFor="output-words">Output Words</Label.Root>
          <textarea id="output-words" value={outputDisplay} readOnly />
          <div className="buttons">
            <button onClick={runSc}>Apply</button>
          </div>
        </div>
      </main>
    </>
  );

  async function runSc() {
    console.log("Hello!");
    console.log(JSON.stringify(inputWords));
    console.log(inputWords.split(/[\r\n]+/));
    const response = await axios.post<Scv1Response>("/api/scv1", {
      changes: soundChanges,
      inputWords: inputWords.split(/[\r\n]+/),
    });
    setOutputDisplay(response.data.outputWords.join("\n"));
  }
}
