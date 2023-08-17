import { UndefinedLexeme } from "@/glitch/Glitch";
import { FlatTranslation } from "@/translation/FlatTranslation";

export default interface FlatGlitch {
  id: string;
  languageId?: string;
  dependent: FlatDependent;
  referent: FlatReferent;
}

export interface FlatDependentTranslation {
  type: "Translation";
  value: FlatTranslation & { id: string };
  invalidPartPath: [string | number][];
}

export type FlatDependent = FlatDependentTranslation;

export type FlatReferent = UndefinedLexeme;
