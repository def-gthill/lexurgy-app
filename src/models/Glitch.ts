import Translation from "./Translation";

export default interface Glitch {
  id: string;
  languageId?: string;
  dependent: Dependent;
  referent: Referent;
}

export interface DependentTranslation {
  type: "Translation";
  value: Translation;
  invalidPartPath: [string | number][];
}

export type Dependent = DependentTranslation; // Add more | clauses

export interface UndefinedLexeme {
  referenceType: "Undefined";
  type: "Lexeme";
  searchTerm: string;
}

export type Referent = UndefinedLexeme; // Add more | clauses
