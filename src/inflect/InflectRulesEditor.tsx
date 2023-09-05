import Select from "@/components/Select";
import {
  Formula,
  FormulaType,
  InflectRules,
  isTree,
} from "@/inflect/InflectRules";
import { rekey, update } from "@/map";

export default function InflectRulesEditor({
  rules,
  saveRules,
}: {
  rules: InflectRules;
  saveRules: (rules: InflectRules) => void;
}) {
  if (typeof rules === "string") {
    return (
      <div id="rules" className="editor">
        <input
          type="text"
          value={rules}
          onChange={(event) => saveRules(event.target.value)}
        />
        <div className="buttons">
          <button onClick={() => saveRules({ branches: new Map([["", ""]]) })}>
            Branch
          </button>
          <button
            onClick={() => saveRules({ formula: { type: "form", form: "" } })}
          >
            Formula
          </button>
        </div>
      </div>
    );
  } else if (isTree(rules)) {
    return (
      <div className="editor">
        <table>
          <thead>
            <tr>
              <th>Condition</th>
              <th>Rules</th>
            </tr>
          </thead>
          <tbody>
            {[...rules.branches].map(([category, branch], i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    onChange={(event) =>
                      renameCategory(category, event.target.value)
                    }
                  />
                </td>
                <td>
                  <InflectRulesEditor
                    rules={branch}
                    saveRules={(branch) => setBranch(category, branch)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttons">
          <button onClick={addBranch}>Add Branch</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="editor">
        <Select
          id="formula-type"
          options={[
            { name: "Fixed Form", value: "form" },
            { name: "Stem", value: "stem" },
          ]}
          onChange={setFormulaType}
        />
      </div>
    );
  }

  function renameCategory(category: string, newName: string) {
    if (isTree(rules)) {
      saveRules({ branches: rekey(rules.branches, category, newName) });
    }
  }

  function setBranch(category: string, branch: InflectRules) {
    if (isTree(rules)) {
      saveRules({
        branches: update(rules.branches, [category, branch]),
      });
    }
  }

  function addBranch() {
    if (isTree(rules)) {
      saveRules({ branches: update(rules.branches, ["", ""]) });
    }
  }

  function setFormulaType(type: FormulaType) {
    saveRules(emptyFormula(type));
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
}
