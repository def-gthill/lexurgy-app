import getDriver from "@/db";
import Language from "@/models/Language";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language>
) {
  if (req.method === "GET") {
    const { id } = req.query;
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (lang:Language {id: $id}) RETURN lang;",
        { id }
      );
      if (result.records.length === 0) {
        res.status(404);
      }
      const language: Language = {
        id: result.records[0].get("lang").properties.id,
        name: result.records[0].get("lang").properties.name,
      };
      res.status(200).json(language);
    } finally {
      await session.close();
    }
  }
}
