import Construction from "./Construction";
import Word from "./Word";

export default interface SyntaxNode {
  nodeTypeId?: string;
  construction?: Construction;
  children: Record<string, Word | SyntaxNode>;
}

export function structureToRomanized(structure: SyntaxNode): string {
  if (structure.construction) {
    return finishTranslation(
      structure.construction.children
        .map((childName) => childToRomanized(structure.children[childName]))
        .join(" ")
    );
  } else {
    return finishTranslation(
      Object.values(structure.children).map(childToRomanized).join(" ")
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
