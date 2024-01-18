import * as Schema from "@/components/Schema";

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

const rulesRef = Schema.ref<InflectRules>();
const formulaRef = Schema.ref<Formula>();

export const inflectRulesSchema: Schema.Schema<InflectRules> = Schema.defineRef(
  Schema.union<InflectRules>("Inflection Rules", [
    Schema.string("Fixed Form"),
    Schema.typeKeyedObject("Branch", {
      branches: Schema.map(
        "Branches",
        Schema.string("Category"),
        Schema.callRef("Rules", rulesRef),
        { entryName: "Branch" }
      ),
    }),
    Schema.defineRef(
      Schema.typeKeyedObject("Formula", {
        formula: Schema.taggedUnion<Stem | Fixed | Concat>("Formula", {
          stem: Schema.object("Stem", {}),
          form: Schema.typeKeyedObject("Fixed Form", {
            form: Schema.string("Form"),
          }),
          concat: Schema.typeKeyedObject("Concatenation", {
            parts: Schema.array("Parts", Schema.callRef("Part", formulaRef)),
          }),
        }),
      }),
      formulaRef
    ),
  ]),
  rulesRef
);
