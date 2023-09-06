import { InflectRules } from "@/inflect/InflectRules";

export default interface UserInflectInputs {
  dimensions: { [key: string]: string[] };
  rules: InflectRules;
  stemsAndCategories: (string | StemAndCategory)[];
}

// export type UserInflectRules = string | UserCategoryTree | Formula;

// export interface UserCategoryTree {
//   [key: string]: UserInflectRules;
// }

export interface StemAndCategory {
  stem: string;
  categories: string[];
}
