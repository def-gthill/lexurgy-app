import Construction from "./Construction";
import Word from "./Word";

export default interface SyntaxNode {
  nodeTypeId?: string;
  construction?: Construction;
  children: [string, Word | SyntaxNode][];
}

export function childrenInOrder(
  structure: SyntaxNode
): [string, Word | SyntaxNode][] {
  return (
    structure.construction?.children
      .filter((childName) =>
        structure.children.some(([name]) => name === childName)
      )
      .map(
        (childName) => structure.children.find(([name]) => name === childName)!
      ) || structure.children
  );
}

export function structureToRomanized(structure: SyntaxNode): string {
  return finishTranslation(
    childrenInOrder(structure)
      .map(([_name, child]) => childToRomanized(child))
      .join(" ")
  );
}

function childToRomanized(child: SyntaxNode | Word): string {
  if ("romanized" in child) {
    return child.romanized;
  } else {
    return structureToRomanized(child);
  }
}

function finishTranslation(translation: string): string {
  return translation[0].toLocaleUpperCase() + translation.slice(1) + ".";
}
