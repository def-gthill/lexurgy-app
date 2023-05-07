import { RequestQuery, collectionEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import Glitch from "@/models/Glitch";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Glitch[]>
) {
  await collectionEndpoint(req, res, getGlitches);
}

async function getGlitches(requestQuery: RequestQuery): Promise<Glitch[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<Glitch>(
      driver,
      `MATCH (gl:Glitch) -[:IS_IN]-> (lang:Language {id: $id})
      MATCH (gl) -[:WAS_FOUND_IN]-> (dependent)
      RETURN gl {.*, dependentId: dependent.id}`,
      { id: languageId }
    )
  ).map((glitch) => ({ ...glitch, languageId }));
  return result;
}
