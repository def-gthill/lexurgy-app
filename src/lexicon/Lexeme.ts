import { RequiredKeys } from "@/models/RequiredKeys";
import Joi from "joi";

export default interface Lexeme {
  id?: string;
  languageId?: string;
  romanized: string;
  pos: string;
  definitions: string[];
}

export type LexemeWithLanguageId = RequiredKeys<Lexeme, "languageId">;

export type SavedLexeme = RequiredKeys<Lexeme, "id" | "languageId">;

export function validateUserLexeme(object: any): Lexeme | string {
  const schema = Joi.object({
    romanized: Joi.string(),
    pos: Joi.string(),
    definitions: Joi.array().items(Joi.string()),
  });
  const { error, value } = schema.validate(object, { presence: "required" });
  if (error) {
    return error.message;
  } else {
    return value as Lexeme;
  }
}
