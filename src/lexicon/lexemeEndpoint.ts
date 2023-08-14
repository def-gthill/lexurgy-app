import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import Lexeme from "@/lexicon/Lexeme";
import * as crypto from "crypto";

const driver = getDriver();

export async function getLexemes(
  requestQuery: RequestQuery
): Promise<Lexeme[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<Lexeme>(
      driver,
      "MATCH (lex:Lexeme) -[:IS_IN]-> (lang:Language {id: $id}) RETURN lex;",
      { id: languageId }
    )
  ).map((lexeme) => ({ ...lexeme, languageId }));
  return result;
}

export async function postLexeme(lexeme: Lexeme): Promise<Lexeme> {
  if (lexeme.id === undefined) {
    lexeme.id = crypto.randomUUID();
  }
  await execute(
    driver,
    `MATCH (lang:Language {id: $languageId})
    MERGE (lex:Lexeme {id: $id}) -[:IS_IN]-> (lang)
    SET lex.romanized = $romanized, lex.pos = $pos, lex.definitions = $definitions`,
    { ...lexeme }
  );
  return lexeme;
}
