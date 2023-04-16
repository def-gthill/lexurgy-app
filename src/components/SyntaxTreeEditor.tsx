import Construction from "@/models/Construction";
import SyntaxNode from "@/models/SyntaxNode";
import Word from "@/models/Word";
import { Fragment, useState } from "react";

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
    Record<string, Word | SyntaxNode>
  >({});

  if (activeConstruction) {
    return (
      <div className="editor">
        {activeConstruction.children.map((child) => (
          <Fragment key={child}>
            <label htmlFor={child}>{child}</label>
            <input
              type="text"
              id={child}
              onChange={(event) =>
                setActiveChildren({
                  ...activeChildren,
                  [child]: { romanized: event.target.value },
                })
              }
            ></input>
          </Fragment>
        ))}
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
        <button onClick={createConstruction}>Create</button>
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
