import { entries, hasElements, keys, toMap, values } from "@/map";
import { RuntimeError } from "@/sc/RuntimeError";
import Scv1Request from "@/sc/Scv1Request";
import Scv1Response from "@/sc/Scv1Response";
import { WordHistory } from "@/sc/WordHistory";
import useScCaching from "@/sc/useScCaching";
import useDebounced from "@/useDebounced";
import { useState } from "react";

export interface ScState {
  soundChanges: string;
  setSoundChanges: (value: string) => void;
  histories: WordHistory[];
  setHistories: (value: WordHistory[]) => void;
  intermediateStageNames: string[];
  setIntermediateStageNames: (value: string[]) => void;
  ruleNames: string[];
  setRuleNames: (value: string[]) => void;
  status: string;
  setStatus: (value: string) => void;
  error: string | null;
  setError: (value: string | null) => void;
  runtimeErrors: RuntimeError[];
  setRuntimeErrors: (value: RuntimeError[]) => void;
  tracing: boolean;
  setTracing: (value: boolean) => void;
  startAtEnabled: boolean;
  setStartAtEnabled: (value: boolean) => void;
  startAt: string | null;
  setStartAt: (value: string | null) => void;
  stopBeforeEnabled: boolean;
  setStopBeforeEnabled: (value: boolean) => void;
  stopBefore: string | null;
  setStopBefore: (value: string | null) => void;
  scRunToggle: number;
  setScRunToggle: (value: number) => void;
  requestValidation: (soundChanges: string) => Promise<void>;
  runSc: () => Promise<void>;
}

export default function useScState(
  getRuleNames: (changes: string) => Promise<string[]>,
  runSoundChanges: (request: Scv1Request) => Promise<Scv1Response>
): ScState {
  const [soundChanges, setSoundChanges] = useState("");
  const [histories, setHistories] = useState<WordHistory[]>([]);
  const [intermediateStageNames, setIntermediateStageNames] = useState<
    string[]
  >([]);
  const [ruleNames, setRuleNames] = useState<string[]>([]);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState<string | null>(null);
  const [runtimeErrors, setRuntimeErrors] = useState<RuntimeError[]>([]);
  const [tracing, setTracing] = useState(false);
  const [startAtEnabled, setStartAtEnabled] = useState(false);
  const [startAt, setStartAt] = useState<string | null>(null);
  const [stopBeforeEnabled, setStopBeforeEnabled] = useState(false);
  const [stopBefore, setStopBefore] = useState<string | null>(null);
  const [scRunToggle, setScRunToggle] = useState(0);

  const inputWords = histories.map((history) => history.inputWord);

  const requestValidation = useDebounced(validate, 500);
  const runScWithCaching = useScCaching(runSoundChanges);

  return {
    soundChanges,
    setSoundChanges,
    histories,
    setHistories,
    intermediateStageNames,
    setIntermediateStageNames,
    ruleNames,
    setRuleNames,
    status,
    setStatus,
    error,
    setError,
    runtimeErrors,
    setRuntimeErrors,
    tracing,
    setTracing,
    startAtEnabled,
    setStartAtEnabled,
    startAt,
    setStartAt,
    stopBeforeEnabled,
    setStopBeforeEnabled,
    stopBefore,
    setStopBefore,
    scRunToggle,
    setScRunToggle,
    requestValidation,

    async runSc() {
      setStatus("Running...");
      const request: Scv1Request = {
        changes: soundChanges,
        inputWords: inputWords,
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
    },
  };

  async function validate(soundChanges: string) {
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
}

function toErrorMessage(error: any) {
  let message = error.message;
  if (error.lineNumber) {
    message += ` (line ${error.lineNumber})`;
  }
  return message;
}
