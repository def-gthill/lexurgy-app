export type InflectRules = string | CategoryTree;

export interface CategoryTree {
  [key: string]: InflectRules;
}
