import { update } from "@/map";
import Construction from "@/models/Construction";
import SyntaxNode from "@/models/SyntaxNode";
import Word from "@/models/Word";
import { useState } from "react";

export default function SyntaxTreeEditor({
  constructions,
  saveTree,
}: {
  constructions: Construction[];
  saveTree: (root: SyntaxNode) => void;
}) {
  const [chosenConstruction, setChosenConstruction] = useState(
    constructions[0].name
  );
  const [activeConstruction, setActiveConstruction] =
    useState<Construction | null>(null);
  const [activeChildren, setActiveChildren] = useState<
    [string, Word | SyntaxNode][]
  >([]);

  if (activeConstruction) {
    return (
      <div className="editor">
        <div style={{ display: "flex", flexDirection: "row" }}>
          {activeConstruction.children.map((child) => (
            <div
              key={child}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label htmlFor={child}>{child}</label>
              <input
                type="text"
                id={child}
                onChange={(event) => {
                  setActiveChildren(
                    update(activeChildren, [
                      child,
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
}
