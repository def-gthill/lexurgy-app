import Word from "@/models/Word";

export default interface SyntaxNode {
  nodeTypeId?: string;
  children: Record<string, Word | SyntaxNode>;
}
