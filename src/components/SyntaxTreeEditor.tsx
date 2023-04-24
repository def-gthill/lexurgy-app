import { update } from "@/map";
import Construction from "@/models/Construction";
import SyntaxNode from "@/models/SyntaxNode";
import Word from "@/models/Word";
import { useState } from "react";

export default function SyntaxTreeEditor({
  constructions,
  root,
  saveTree,
}: {
  constructions: Construction[];
  root?: SyntaxNode;
  saveTree: (root: SyntaxNode) => void;
}) {
  const [chosenConstruction, setChosenConstruction] = useState(
    constructions[0].name
  );
  const [activeConstruction, setActiveConstruction] =
    useState<Construction | null>(root?.construction || null);
  const [activeChildren, setActiveChildren] = useState<
    [string, Word | SyntaxNode][]
  >(root?.children || []);

  if (activeConstruction) {
    return (
      <div className="editor">
        <div style={{ display: "flex", flexDirection: "row" }}>
          {activeConstruction.children.map((childName) => (
            <div
              key={childName}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor={childName}>{childName}</label>
              <input
                type="text"
                id={childName}
                value={getChild(activeChildren, childName)}
                onChange={(event) => {
                  setActiveChildren(
                    update(activeChildren, [
                      childName,
                      { romanized: event.target.value },
                    ])
                  );
                }}
              ></input>
            </div>
          ))}
        </div>
        <div className="buttons">
          <button
            onClick={() =>
              saveTree({
                nodeTypeId: activeConstruction.id,
                construction: activeConstruction,
                children: activeChildren,
              })
            }
          >
            Done
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="editor">
        <label htmlFor="construction">Construction</label>
        <select
          id="construction"
          onChange={(event) => setChosenConstruction(event.target.value)}
        >
          {constructions.map((construction) => (
            <option key={construction.name}>{construction.name}</option>
          ))}
        </select>
        <div className="buttons">
          <button onClick={createConstruction}>Create</button>
        </div>
      </div>
    );
  }

  function createConstruction() {
    setActiveConstruction(
      constructions.find(
        (constructions) => constructions.name === chosenConstruction
      ) || null
    );
  }

  function getChild(
    children: [string, Word | SyntaxNode][],
    childName: string
  ): string {
    const entry = children.find(([name]) => name === childName);
    if (!entry) {
      return "";
    }
    const [_name, child] = entry;
    if ("romanized" in child) {
      return child.romanized;
    } else {
      return "";
    }
  }
}
