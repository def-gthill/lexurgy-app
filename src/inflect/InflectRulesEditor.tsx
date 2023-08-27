import { InflectRules } from "@/inflect/InflectRules";

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
          <button onClick={() => saveRules({ "": "" })}>Branch</button>
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
            {Object.entries(rules).map(([category, branch], i) => (
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
      const newRules = { ...rules };
      newRules[newName] = newRules[category];
      delete newRules[category];
      saveRules(newRules);
    }
  }

  function setBranch(category: string, branch: InflectRules) {
    if (typeof rules === "object") {
      saveRules({ ...rules, [category]: branch });
    }
  }

  function addBranch() {
    if (typeof rules === "object") {
      saveRules({ ...rules, "": "" });
    }
  }
}
