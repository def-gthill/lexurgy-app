import {
  Fixed,
  Formula,
  InflectRules,
  Stem,
  isTree,
} from "@/inflect/InflectRules";
import { mapValues, toObject } from "@/map";

export default interface InflectRequest {
  rules: InflectRequestRules;
  stemsAndCategories: { stem: string; categories: string[] }[];
}

export type InflectRequestRules =
  | RequestForm
  | RequestFormulaForm
  | RequestSplit;

export interface RequestForm {
  type: "form";
  form: string;
}

export interface RequestSplit {
  type: "split";
  branches: Record<string, InflectRequestRules>;
}

export interface RequestFormulaForm {
  type: "formula";
  formula: RequestFormula;
}

export type RequestFormula = Stem | Fixed | RequestConcat;

export interface RequestConcat {
  type: "concat";
  parts: RequestFormula[];
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
      formula: fromFormula(rules),
    };
  }
}

function fromFormula(formula: Formula): RequestFormula {
  if (formula.formula.type === "concat") {
    return { type: "concat", parts: formula.formula.parts.map(fromFormula) };
  } else {
    return formula.formula;
  }
}
