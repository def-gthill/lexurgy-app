import { set } from "@/array";
import EditorPane from "@/components/EditorPane";
import Select from "@/components/Select";
import { Formula, FormulaType } from "@/inflect/InflectRules";

export default function FormulaEditor({
  formula,
  saveFormula,
}: {
  formula: Formula;
  saveFormula: (formula: Formula) => void;
}) {
  return (
    <EditorPane>
      <Select
        id="formula-type"
        options={[
          { name: "Fixed Form", value: "form" },
          { name: "Stem", value: "stem" },
          { name: "Concatenation", value: "concat" },
        ]}
        currentSelection={formula.formula.type}
        onChange={setFormulaType}
      />
      {editorFor(formula)}
    </EditorPane>
  );

  function setFormulaType(type: FormulaType) {
    saveFormula(emptyFormula(type));
  }

  function emptyFormula(type: FormulaType): Formula {
    switch (type) {
      case "stem":
        return { formula: { type: "stem" } };
      case "form":
        return { formula: { type: "form", form: "" } };
      case "concat":
        return { formula: { type: "concat", parts: [emptyFormula("form")] } };
    }
  }

  function editorFor(formula: Formula): JSX.Element {
    switch (formula.formula.type) {
      case "stem":
        return <></>;
      case "form":
        return (
          <input
            type="text"
            value={formula.formula.form}
            onChange={(event) =>
              saveFormula({
                formula: { type: "form", form: event.target.value },
              })
            }
          />
        );
      case "concat": {
        const parts = formula.formula.parts;
        return (
          <EditorPane>
            {parts.map((part, i) => (
              <FormulaEditor
                key={i}
                formula={part}
                saveFormula={(formula) =>
                  saveFormula({
                    formula: { type: "concat", parts: set(parts, i, formula) },
                  })
                }
              />
            ))}
            <div className="buttons">
              <button
                onClick={() =>
                  saveFormula({
                    formula: {
                      type: "concat",
                      parts: [...parts, emptyFormula("form")],
                    },
                  })
                }
              >
                Add Part
              </button>
            </div>
          </EditorPane>
        );
      }
    }
  }
}
