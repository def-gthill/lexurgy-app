import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import Language from "@/language/Language";
import crypto from "crypto";

const driver = getDriver();

export async function postLanguage(
  language: Language,
  userId: string
): Promise<Language> {
  console.log(`User ${userId} is t3h conl4ng1nat0r`);
  if (language.id === undefined) {
    language.id = crypto.randomUUID();
  }
  await execute(
    driver,
    `MERGE (lang:Language {id: $id}) SET lang.name = $name
    WITH lang
    MATCH (user:User {id: $userId})
    CREATE (user) -[:OWNS]-> (lang)`,
    {
      ...language,
      userId,
    }
  );
  return language;
}

export async function getLanguages(
  _requestQuery: RequestQuery,
  userId: string
): Promise<Language[]> {
  return await query<Language>(
    driver,
    "MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language) RETURN lang;",
    { userId }
  );
}

export async function getLanguage(id: string): Promise<Language[]> {
  return await query<Language>(
    driver,
    "MATCH (lang:Language {id: $id}) RETURN lang;",
    { id }
  );
}

export async function deleteLanguage(id: string): Promise<Language[]> {
  return await query<Language>(
    driver,
    `MATCH (lang:Language {id: $id})
    OPTIONAL MATCH (lang) <-[:IS_IN]- (n)
    DETACH DELETE lang, n RETURN lang`,
    { id }
  );
}
