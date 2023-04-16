import Construction from "./Construction";
import Word from "./Word";

export default interface SyntaxNode {
  nodeTypeId?: string;
  construction?: Construction;
  children: Record<string, Word | SyntaxNode>;
}
