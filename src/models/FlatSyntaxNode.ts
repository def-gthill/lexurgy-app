import Construction from "./Construction";
import SyntaxNode from "./SyntaxNode";
import Translation from "./Translation";
import Word from "./Word";

export interface FlatTranslation extends Translation {
  flatStructure?: FlatStructure;
}

export interface FlatStructure {
  nodes: FlatSyntaxNode[];
  limbs: Limb[];
}

export interface FlatSyntaxNode {
  id: number;
  nodeTypeId?: string;
  construction?: Construction;
}

export interface Limb {
  parent: number;
  childName: string;
  child: number | Word;
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
  const directLimbs = structure.children.map(([name, child]) => ({
    parent: structure.id,
    childName: name,
    child: "romanized" in child ? child : child.id,
  }));

  const flatChildren = structure.children.flatMap(([_name, child]) =>
    "romanized" in child ? [] : flattenStructureWithIds(child)
  );

  const thisNode: FlatSyntaxNode & {
    children?: [string, Word | SyntaxNode][];
  } = structure;
  delete thisNode.children;

  return {
    nodes: [thisNode, ...flatChildren.flatMap((child) => child.nodes)],
    limbs: [...directLimbs, ...flatChildren.flatMap((child) => child.limbs)],
  };
}

interface SyntaxNodeWithId {
  id: number;
  nodeTypeId?: string;
  construction?: Construction;
  children: [string, Word | SyntaxNodeWithId][];
}
