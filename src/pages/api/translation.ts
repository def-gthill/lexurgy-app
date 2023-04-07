import getDriver from "@/db";
import Translation from "@/models/Translation";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation[]>
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
  }
}
