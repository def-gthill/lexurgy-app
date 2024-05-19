import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import _ from "lodash";
import { useState } from "react";

interface ScRun {
  request: Scv1Request;
  result: Scv1Response;
}

export default function useScCaching(
  runSc: (request: Scv1Request) => Promise<Scv1Response>
) {
  const [lastRun, setLastRun] = useState<ScRun | null>(null);

  return async function runScWithCaching(
    request: Scv1Request
  ): Promise<Scv1Response> {
    if (
      lastRun?.request?.changes !== request.changes ||
      lastRun?.request?.startAt !== request.startAt ||
      lastRun?.request?.stopBefore !== request.stopBefore
    ) {
      const result = await runSc(request);
      setLastRun({ request, result });
      return result;
    }
    const lastInputWords = new Set(lastRun?.request?.inputWords ?? []);
    const lastTraceWords = new Set(lastRun?.request?.traceWords ?? []);
    const newTraceWords = new Set(request.traceWords);
    const filteredRequest = {
      ...request,
      inputWords: request.inputWords.filter(
        (word) =>
          !lastInputWords.has(word) ||
          lastTraceWords.has(word) !== newTraceWords.has(word)
      ),
    };
    const result = await runSc(filteredRequest);
    if (lastRun) {
      const combiner = new OutputWordCombiner({
        savedInputWords: lastRun.request.inputWords,
        newInputWords: filteredRequest.inputWords,
        allInputWords: request.inputWords,
      });
      result.outputWords = combiner.combineOutputWords({
        savedOutputWords: lastRun.result.outputWords,
        newOutputWords: result.outputWords,
      });
      if (lastRun.result.intermediateWords) {
        result.intermediateWords = _.mapValues(
          result.intermediateWords,
          (words, stageName) =>
            combiner.combineOutputWords({
              savedOutputWords: lastRun.result.intermediateWords![stageName],
              newOutputWords: words,
            })
        );
      }
      if (lastRun.result.traces) {
        result.traces = _.merge(result.traces, lastRun.result.traces);
      }
      result.errors = [
        ...(result.errors ?? []),
        ...(lastRun.result.errors ?? []),
      ];
    }
    setLastRun({ request, result });
    return result;
  };
}

class OutputWordCombiner {
  savedInputWords: string[];
  newInputWords: string[];
  allInputWords: string[];

  constructor({
    savedInputWords,
    newInputWords,
    allInputWords,
  }: {
    savedInputWords: string[];
    newInputWords: string[];
    allInputWords: string[];
  }) {
    this.savedInputWords = savedInputWords;
    this.newInputWords = newInputWords;
    this.allInputWords = allInputWords;
  }

  combineOutputWords({
    savedOutputWords,
    newOutputWords,
  }: {
    savedOutputWords: string[];
    newOutputWords: string[];
  }) {
    const inputWordsToOutputWords = new Map();
    for (let i = 0; i < this.savedInputWords.length; i++) {
      inputWordsToOutputWords.set(this.savedInputWords[i], savedOutputWords[i]);
    }
    for (let i = 0; i < this.newInputWords.length; i++) {
      inputWordsToOutputWords.set(this.newInputWords[i], newOutputWords[i]);
    }
    return this.allInputWords.map((inputWord) =>
      inputWordsToOutputWords.get(inputWord)
    );
  }
}
