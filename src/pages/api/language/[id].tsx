import getDriver from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export interface Language {
  id: string;
  name: string;
}

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
      const language = result.records[0].get("lang").properties;
      res.status(200).json(language);
    } finally {
      await session.close();
    }
  }
}
