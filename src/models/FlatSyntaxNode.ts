import Construction from "./Construction";
import SyntaxNode from "./SyntaxNode";
import Translation from "./Translation";
import Word from "./Word";

export interface FlatTranslation extends Translation {
  flatStructure?: FlatStructure;
}

export interface FlatStructure {
  root: FlatSyntaxNode;
  nodeLimbs: NodeLimb[];
  wordLimbs: WordLimb[];
}

export interface FlatSyntaxNode {
  id: number;
  nodeTypeId?: string;
  construction?: Construction;
}

export interface NodeLimb {
  parent: number;
  childName: string;
  child: FlatSyntaxNode;
}

export interface WordLimb {
  parent: number;
  childName: string;
  child: Word;
}

export function flatten(translation: Translation): FlatTranslation {
  return {
    ...translation,
    flatStructure: translation.structure
      ? flattenStructure(translation.structure)
      : undefined,
  };
}

export function flattenStructure(structure: SyntaxNode): FlatStructure {
  const { nodeWithIds } = assignIds(structure, 0);
  return flattenStructureWithIds(nodeWithIds);
}

function assignIds(
  structure: SyntaxNode,
  firstId: number = 0
): { nodeWithIds: SyntaxNodeWithId; nextId: number } {
  const childrenWithIds: [string, Word | SyntaxNodeWithId][] = [];
  let nextId = firstId + 1;
  for (const [_name, child] of structure.children) {
    if ("romanized" in child) {
      childrenWithIds.push([_name, child]);
    } else {
      const { nodeWithIds, nextId: nextId_ } = assignIds(child, nextId);
      childrenWithIds.push([_name, nodeWithIds]);
      nextId = nextId_;
    }
  }
  return {
    nodeWithIds: {
      ...structure,
      id: firstId,
      children: childrenWithIds,
    },
    nextId,
  };
}

function flattenStructureWithIds(structure: SyntaxNodeWithId): FlatStructure {
  const directNodeLimbs: NodeLimb[] = structure.children.flatMap(
    ([name, child]) =>
      "romanized" in child
        ? []
        : {
            parent: structure.id,
            childName: name,
            child: flattenNode(child),
          }
  );

  const directWordLimbs: WordLimb[] = structure.children.flatMap(
    ([name, child]) =>
      "romanized" in child
        ? {
            parent: structure.id,
            childName: name,
            child,
          }
        : []
  );

  const flatChildren = structure.children.flatMap(([_name, child]) =>
    "romanized" in child ? [] : flattenStructureWithIds(child)
  );

  return {
    root: flattenNode(structure),
    nodeLimbs: [
      ...directNodeLimbs,
      ...flatChildren.flatMap((child) => child.nodeLimbs),
    ],
    wordLimbs: [
      ...directWordLimbs,
      ...flatChildren.flatMap((child) => child.wordLimbs),
    ],
  };
}

function flattenNode(node: SyntaxNodeWithId): FlatSyntaxNode {
  const result: FlatSyntaxNode & {
    children?: [string, Word | SyntaxNode][];
  } = { ...node };
  delete result.children;
  return result;
}

interface SyntaxNodeWithId {
  id: number;
  nodeTypeId?: string;
  construction?: Construction;
  children: [string, Word | SyntaxNodeWithId][];
}
