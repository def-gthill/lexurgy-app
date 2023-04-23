import { RequestQuery, collectionEndpoint } from "@/api";
import getDriver, { execute, query } from "@/db";
import Construction from "@/models/Construction";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Construction | Construction[]>
) {
  await collectionEndpoint(req, res, getConstructions, postConstruction);
}

async function getConstructions(
  requestQuery: RequestQuery
): Promise<Construction[]> {
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

async function postConstruction(
  construction: Construction
): Promise<Construction> {
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
