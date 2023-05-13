import { FlatTranslation } from "./FlatTranslation";
import { UndefinedLexeme } from "./Glitch";
import { Saved } from "./Saved";

export default interface FlatGlitch {
  id: string;
  languageId?: string;
  dependent: FlatDependent;
  referent: FlatReferent;
}

export interface FlatDependentTranslation {
  type: "Translation";
  value: Saved<FlatTranslation>;
  invalidPartPath: [string | number][];
}

export type FlatDependent = FlatDependentTranslation;

export type FlatReferent = UndefinedLexeme;
