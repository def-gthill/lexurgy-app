import { RuntimeError } from "@/sc/RuntimeError";

export default interface Scv1Response {
  ruleNames: string[];
  outputWords: string[];
  intermediateWords?: Record<string, string[]>;
  traces?: Record<string, { rule: string; output: string }[]>;
  errors?: RuntimeError[];
}
