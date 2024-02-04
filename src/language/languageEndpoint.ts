import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import Language from "@/language/Language";
import crypto from "crypto";

const driver = getDriver();

export async function postLanguage(
  language: Language,
  userId: string
): Promise<Language> {
  if (language.id === undefined) {
    language.id = crypto.randomUUID();
  }
  let query = `MATCH (user:User {id: $userId})
  MERGE (user) -[:OWNS]-> (lang:Language {id: $id})
  SET lang.name = $name`;
  if (language.worldId) {
    query += `
    WITH lang
    OPTIONAL MATCH (lang) -[rel:IS_IN]-> (world:World)
    DELETE rel
    WITH lang
    MATCH (world:World {id: $worldId})
    MERGE (lang) -[:IS_IN]-> (world)`;
  }
  await execute(driver, query, {
    ...language,
    userId,
  });
  return language;
}

export async function getLanguages(
  requestQuery: RequestQuery,
  userId: string
): Promise<Language[]> {
  const worldId = requestQuery.world;
  let dbQuery;
  if (!worldId) {
    dbQuery = `MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language)
      OPTIONAL MATCH (lang) -[:IS_IN]-> (world:World)
      RETURN lang{.*, worldId: world.id}`;
  } else if (worldId === "none") {
    dbQuery = `MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language)
    OPTIONAL MATCH (lang) -[:IS_IN]-> (world:World)
    WITH lang, world
    WHERE world IS NULL
    RETURN lang`;
  } else {
    dbQuery = `MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language) -[:IS_IN]-> (world:World {id: $worldId})
      RETURN lang{.*, worldId: world.id};`;
  }
  return await query<Language>(driver, dbQuery, { userId, worldId });
}

export async function getLanguage(
  id: string,
  userId: string
): Promise<Language[]> {
  return await query<Language>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language {id: $id})
    OPTIONAL MATCH (lang) -[:IS_IN]-> (world:World)
    RETURN lang{.*, worldId: world.id};`,
    { id, userId }
  );
}

export async function deleteLanguage(
  id: string,
  userId: string
): Promise<Language[]> {
  return await query<Language>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (lang:Language {id: $id})
    OPTIONAL MATCH (lang) <-[:IS_IN]- (n)
    DETACH DELETE lang, n RETURN lang`,
    { id, userId }
  );
}
