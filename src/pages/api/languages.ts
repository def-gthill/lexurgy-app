import getDriver from "@/db";
import Language from "@/models/Language";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | Language[]>
) {
  if (req.method === "GET") {
    const session = driver.session();
    try {
      const result = await session.run("MATCH (lang:Language) RETURN lang;");
      const languages: Language[] = result.records.map((record) => ({
        id: record.get("lang").properties.id,
        name: record.get("lang").properties.name,
      }));
      res.status(200).json(languages);
    } finally {
      await session.close();
    }
  } else if (req.method === "POST") {
    const session = driver.session();
    const language = req.body as Language;
    if (language.id === undefined) {
      language.id = crypto.randomUUID();
    }
    try {
      await session.run(`CREATE (:Language {id: $id, name: $name})`, language);
      res.status(201).json(language);
    } finally {
      await session.close();
    }
  }
}
