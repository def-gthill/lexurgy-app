export type InflectRules = string | CategoryTree;

export interface CategoryTree {
  branches: Map<string, InflectRules>;
}
