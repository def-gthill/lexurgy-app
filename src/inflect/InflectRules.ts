export type InflectRules = string | CategoryTree | Formula;

export function isTree(rules: InflectRules): rules is CategoryTree {
  return typeof rules === "object" && "branches" in rules;
}

export function isFormula(rules: InflectRules): rules is Formula {
  return typeof rules === "object" && "formula" in rules;
}

export interface CategoryTree {
  branches: Map<string, InflectRules>;
}

export interface Formula {
  formula: Stem | Fixed | Concat;
}

export type FormulaType = "stem" | "form" | "concat";

export interface Stem {
  type: "stem";
}

export interface Fixed {
  type: "form";
  form: string;
}

export interface Concat {
  type: "concat";
  parts: Formula[];
}
