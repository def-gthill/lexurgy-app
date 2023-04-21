import getDriver, { execute, query } from "@/db";
import Language from "@/models/Language";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | Language[]>
) {
  if (req.method === "GET") {
    const result = await query<Language>(
      driver,
      "MATCH (lang:Language) RETURN lang;"
    );
    res.status(200).json(result);
  } else if (req.method === "POST") {
    const language = req.body as Language;
    if (language.id === undefined) {
      language.id = crypto.randomUUID();
    }
    await execute(driver, "CREATE (:Language {id: $id, name: $name})", {
      ...language,
    });
    res.status(201).json(language);
  }
}
