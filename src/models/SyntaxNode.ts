import Construction from "./Construction";
import Word from "./Word";

export default interface SyntaxNode {
  nodeTypeId?: string;
  construction?: Construction;
  children: [string, Word | SyntaxNode][];
}

export function structureToRomanized(structure: SyntaxNode): string {
  if (structure.construction) {
    return finishTranslation(
      structure.construction.children
        .map((childName) =>
          childToRomanized(
            structure.children.find(([name]) => name === childName)![1]
          )
        )
        .join(" ")
    );
  } else {
    return finishTranslation(
      structure.children
        .map(([_name, child]) => childToRomanized(child))
        .join(" ")
    );
  }
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
