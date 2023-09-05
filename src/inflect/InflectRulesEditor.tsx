import { InflectRules } from "@/inflect/InflectRules";
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
        </div>
      </div>
    );
  } else {
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
  }

  function renameCategory(category: string, newName: string) {
    if (typeof rules === "object") {
      saveRules({ branches: rekey(rules.branches, category, newName) });
    }
  }

  function setBranch(category: string, branch: InflectRules) {
    if (typeof rules === "object") {
      saveRules({
        branches: update(rules.branches, [category, branch]),
      });
    }
  }

  function addBranch() {
    if (typeof rules === "object") {
      saveRules({ branches: update(rules.branches, ["", ""]) });
    }
  }
}
