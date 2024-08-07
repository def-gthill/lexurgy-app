import Construction from "../syntax/Construction";
import SyntaxNode from "./SyntaxNode";
import Translation from "./Translation";
import Word from "./Word";

export interface FlatTranslation extends Translation {
  flatStructure?: FlatStructure;
}

// The root always has ID 0
export interface FlatStructure {
  nodes: FlatSyntaxNode[];
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
  child: number;
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
            child: child.id,
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
    nodes: [
      flattenNode(structure),
      ...flatChildren.flatMap((child) => child.nodes),
    ],
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

export function inflate(flatTranslation: FlatTranslation): Translation {
  const result = {
    ...flatTranslation,
    structure: flatTranslation.flatStructure
      ? inflateStructure(flatTranslation.flatStructure)
      : undefined,
  };
  delete result.flatStructure;
  return result;
}

export function inflateStructure(flatStructure: FlatStructure): SyntaxNode {
  const nodes: SyntaxNode[] = [];
  for (const node of flatStructure.nodes) {
    nodes[node.id] = inflateNode(node);
  }
  for (const { parent, childName, child } of flatStructure.nodeLimbs) {
    nodes[parent].children.push([childName, nodes[child]]);
  }
  for (const { parent, childName, child } of flatStructure.wordLimbs) {
    nodes[parent].children.push([childName, child]);
  }
  return nodes[0];
}

function inflateNode(node: FlatSyntaxNode): SyntaxNode {
  const result: SyntaxNode & {
    id?: number;
  } = { ...node, children: [] };
  delete result.id;
  return result;
}
