import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import Construction from "@/syntax/Construction";
import * as crypto from "crypto";

export async function getConstructions(
  requestQuery: RequestQuery
): Promise<Construction[]> {
  const driver = await getDriver();
  const languageId = requestQuery.language as string;
  const result = (
    await query<Construction>(
      driver,
      "MATCH (cons:Construction) -[:IS_IN]-> (lang:Language {id: $id}) RETURN cons;",
      { id: languageId }
    )
  ).map((construction) => ({ ...construction, languageId }));
  return result;
}

export async function postConstruction(
  construction: Construction
): Promise<Construction> {
  const driver = await getDriver();
  if (construction.id === undefined) {
    construction.id = crypto.randomUUID();
  }
  await execute(
    driver,
    `MATCH (lang:Language {id: $languageId})
    MERGE (cons:Construction {id: $id}) -[:IS_IN]-> (lang)
    SET cons.name = $name, cons.children = $children`,
    { ...construction }
  );
  return construction;
}
