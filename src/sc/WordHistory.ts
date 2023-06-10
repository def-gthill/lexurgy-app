export interface WordHistory {
  inputWord: string;
  outputWord: string | null;
  intermediates: Map<string, string>;
  tracing: boolean;
}
