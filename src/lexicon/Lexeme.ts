import { RequiredKeys } from "@/models/RequiredKeys";

export default interface Lexeme {
  id?: string;
  languageId?: string;
  romanized: string;
  pos: string;
  definitions: string[];
}

export type SavedLexeme = RequiredKeys<Lexeme, "id" | "languageId">;
