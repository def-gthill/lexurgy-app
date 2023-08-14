import { UndefinedLexeme } from "@/glitch/Glitch";
import { Saved } from "@/models/Saved";
import { FlatTranslation } from "@/translation/FlatTranslation";

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
