import * as Schema from "@/components/Schema";
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

export function lexemeSchema(languageName: string): Schema.Schema<Lexeme> {
  return Schema.object<Lexeme>("Lexicon Entry", {
    romanized: Schema.string(`${languageName} Word`),
    pos: Schema.string("Part of Speech"),
    definitions: Schema.array("Definitions", Schema.string("Definition")),
  });
}

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
