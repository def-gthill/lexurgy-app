import { Formula, InflectRules, isTree } from "@/inflect/InflectRules";
import { mapValues, toObject } from "@/map";

export default interface InflectRequest {
  rules: InflectRequestRules;
  stemsAndCategories: { stem: string; categories: string[] }[];
}

export type InflectRequestRules =
  | InflectRequestForm
  | InflectRequestFormula
  | InflectRequestSplit;

export interface InflectRequestForm {
  type: "form";
  form: string;
}

export type InflectRequestFormula = { type: "formula" } & Formula;

export interface InflectRequestSplit {
  type: "split";
  branches: Record<string, InflectRequestRules>;
}

export function fromRules(rules: InflectRules): InflectRequestRules {
  if (typeof rules === "string") {
    return {
      type: "form",
      form: rules,
    };
  } else if (isTree(rules)) {
    return {
      type: "split",
      branches: toObject(mapValues(rules.branches, fromRules)),
    };
  } else {
    return {
      type: "formula",
      ...rules,
    };
  }
}
