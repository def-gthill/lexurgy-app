export default interface UserInflectInputs {
  dimensions: { [key: string]: string[] };
  rules: string | UserCategoryTree;
  stemsAndCategories: (string | StemAndCategory)[];
}

export interface UserCategoryTree {
  [key: string]: string | UserCategoryTree;
}

export interface StemAndCategory {
  stem: string;
  categories: string[];
}
