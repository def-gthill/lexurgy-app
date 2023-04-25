import { resourceEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import Language from "@/models/Language";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | string>
) {
  await resourceEndpoint(req, res, getLanguage, deleteLanguage);
}

async function getLanguage(id: string): Promise<Language[]> {
  return await query<Language>(
    driver,
    "MATCH (lang:Language {id: $id}) RETURN lang;",
    { id }
  );
}

async function deleteLanguage(id: string): Promise<Language[]> {
  return await query<Language>(
    driver,
    `MATCH (lang:Language {id: $id})
    OPTIONAL MATCH (lang) <-[:IS_IN]- (n)
    DETACH DELETE lang, n RETURN lang`,
    { id }
  );
}
