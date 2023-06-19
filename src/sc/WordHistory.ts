export interface WordHistory {
  inputWord: string;
  outputWord: string | null;
  intermediates: Map<string, string>;
  tracing: boolean;
}

export function emptyHistory(inputWord: string = "") {
  return {
    inputWord,
    outputWord: null,
    intermediates: new Map(),
    tracing: false,
  };
}
