import { updateAssociationArray } from "@/array";
import EditorPane from "@/components/EditorPane";
import Construction from "@/syntax/Construction";
import SyntaxNode from "@/translation/SyntaxNode";
import SyntaxTreeView from "@/translation/SyntaxTreeView";
import Word from "@/translation/Word";
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
      <EditorPane>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {activeConstruction.children.map((childName) => {
            let child = getChildNode(activeChildren, childName);
            if (!child) {
              child = { romanized: "" };
            }
            return (
              <ChildEditor
                key={childName}
                constructions={constructions}
                childName={childName}
                child={child}
                onChange={(newValue) =>
                  setActiveChildren(
                    updateAssociationArray(activeChildren, [
                      childName,
                      newValue,
                    ])
                  )
                }
              />
            );
          })}
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
            disabled={
              activeChildren.filter(([_childName, child]) => isComplete(child))
                .length < activeConstruction.children.length
            }
          >
            Done
          </button>
        </div>
      </EditorPane>
    );
  } else {
    return (
      <EditorPane>
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
      </EditorPane>
    );
  }

  function createConstruction() {
    setActiveConstruction(
      constructions.find(
        (constructions) => constructions.name === chosenConstruction
      ) || null
    );
  }

  function getChildNode(
    children: [string, Word | SyntaxNode][],
    childName: string
  ): Word | SyntaxNode | undefined {
    const entry = children.find(([name]) => name === childName);
    if (!entry) {
      return undefined;
    }
    const [_name, child] = entry;
    return child;
  }

  function isComplete(child: Word | SyntaxNode): boolean {
    if ("romanized" in child) {
      return !!child.romanized;
    } else {
      return (
        child.children.filter(([_childName, child]) => isComplete(child))
          .length === child.construction?.children.length
      );
    }
  }
}

function ChildEditor({
  constructions,
  childName,
  child,
  onChange,
}: {
  constructions: Construction[];
  childName: string;
  child: Word | SyntaxNode;
  onChange: (newValue: Word | SyntaxNode) => void;
}) {
  const [editingSubtree, setEditingSubtree] = useState(true);
  if ("romanized" in child) {
    return (
      <EditorPane
        key={childName}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label htmlFor={childName}>{childName}</label>
        <input
          type="text"
          id={childName}
          value={child.romanized}
          onChange={(event) => {
            onChange({ romanized: event.target.value });
          }}
        ></input>
        <div className="buttons">
          <button onClick={() => onChange({ children: [] })}>Expand</button>
        </div>
      </EditorPane>
    );
  } else if (editingSubtree) {
    return (
      <SyntaxTreeEditor
        key={childName}
        constructions={constructions}
        root={child}
        saveTree={(root: SyntaxNode) => {
          setEditingSubtree(false);
          onChange(root);
        }}
      />
    );
  } else {
    return <SyntaxTreeView root={child} />;
  }
}
