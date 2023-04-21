import { collectionEndpoint } from "@/api";
import getDriver, { execute, query } from "@/db";
import Language from "@/models/Language";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | Language[]>
) {
  collectionEndpoint(req, res, getLanguages, postLanguage);
}

async function getLanguages(): Promise<Language[]> {
  return await query<Language>(driver, "MATCH (lang:Language) RETURN lang;");
}

async function postLanguage(language: Language): Promise<Language> {
  if (language.id === undefined) {
    language.id = crypto.randomUUID();
  }
  await execute(driver, "CREATE (:Language {id: $id, name: $name})", {
    ...language,
  });
  return language;
}
