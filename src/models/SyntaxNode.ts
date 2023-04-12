import Word from "@/models/Word";

export default interface SyntaxNode {
  id?: string;
  nodeTypeId?: string;
  children: Record<string, Word | SyntaxNode>;
}
