import SyntaxNode from "@/models/SyntaxNode";
import Word from "@/models/Word";
import { Fragment } from "react";

export default function SyntaxTreeView({ root }: { root: SyntaxNode }) {
  return (
    <div>
      {Object.entries(root.children)
        .filter(([_childName, child]) => "romanized" in child)
        .map(([childName, child]) => (
          <Fragment key={childName}>
            <div>{childName}</div>
            <div>{(child as Word).romanized}</div>
          </Fragment>
        ))}
    </div>
  );
}
