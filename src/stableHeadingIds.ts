import { Processor, Transformer } from "unified";
import { Node } from "unist";

export function stableHeadingIds(this: Processor): Transformer {
  return function transformer(root: Node): Node {
    return transformRecursive(root);
  };
}

function transformRecursive(node: Node): Node {
  if (isHeading(node)) {
    console.log(node.children);
  }
  return node;
}

function isHeading(node: Node): node is Node & { children: Node[] } {
  return (
    typeof node === "object" &&
    node.type === "element" &&
    "tagName" in node &&
    typeof node.tagName === "string" &&
    "properties" in node &&
    typeof node.properties === "object" &&
    "children" in node
  );
}
