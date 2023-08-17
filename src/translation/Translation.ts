import { RequiredKeys } from "@/models/RequiredKeys";
import SyntaxNode from "./SyntaxNode";

export default interface Translation {
  id?: string;
  languageId?: string;
  romanized: string;
  structure?: SyntaxNode;
  translation: string;
}

export type SavedTranslation = RequiredKeys<Translation, "id" | "languageId">;
