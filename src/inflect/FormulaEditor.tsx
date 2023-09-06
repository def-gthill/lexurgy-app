import { set } from "@/array";
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
    <div className="editor">
      <Select
        id="formula-type"
        options={[
          { name: "Fixed Form", value: "form" },
          { name: "Stem", value: "stem" },
          { name: "Concatenation", value: "concat" },
        ]}
        onChange={setFormulaType}
      />
      {editorFor(formula)}
    </div>
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
          <div className="editor">
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
          </div>
        );
      }
    }
  }
}
