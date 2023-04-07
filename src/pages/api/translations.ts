import getDriver from "@/db";
import Translation from "@/models/Translation";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | Translation[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id}) RETURN tr;",
        { id: languageId }
      );
      const translations: Translation[] = result.records.map((record) => ({
        id: record.get("tr").properties.id as string,
        languageId,
        romanized: record.get("tr").properties.romanized as string,
        translation: record.get("tr").properties.translation as string,
      }));
      res.status(200).json(translations);
    } finally {
      await session.close();
    }
  } else if (req.method === "POST") {
    const session = driver.session();
    const translation = req.body as Translation;
    if (translation.id === undefined) {
      translation.id = crypto.randomUUID();
    }
    try {
      await session.run(
        `MATCH (lang:Language {id: $languageId})
        CREATE (tr:Translation {id: $id, romanized: $romanized, translation: $translation})
        CREATE (tr) -[:IS_IN]-> (lang);`,
        translation
      );
      res.status(201).json(translation);
    } finally {
      await session.close();
    }
  }
}
