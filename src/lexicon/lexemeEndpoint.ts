import { RequestQuery, addId } from "@/api";
import getDriver, { execute, query } from "@/db";
import Lexeme, { SavedLexeme } from "@/lexicon/Lexeme";
import { RequiredKeys } from "@/models/RequiredKeys";

const driver = getDriver();

export async function getLexemes(
  requestQuery: RequestQuery
): Promise<SavedLexeme[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<RequiredKeys<Lexeme, "id">>(
      driver,
      "MATCH (lex:Lexeme) -[:IS_IN]-> (lang:Language {id: $id}) RETURN lex;",
      { id: languageId }
    )
  ).map((lexeme) => ({ ...lexeme, languageId }));
  return result;
}

export async function postLexeme(
  lexeme: RequiredKeys<Lexeme, "languageId">
): Promise<SavedLexeme> {
  const lexemeWithId = addId(lexeme);
  await execute(
    driver,
    `MATCH (lang:Language {id: $languageId})
    MERGE (lex:Lexeme {id: $id}) -[:IS_IN]-> (lang)
    SET lex.romanized = $romanized, lex.pos = $pos, lex.definitions = $definitions`,
    { ...lexemeWithId }
  );
  return lexemeWithId;
}
