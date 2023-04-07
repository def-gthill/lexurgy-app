import getDriver from "@/db";
import Language from "@/models/Language";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language[]>
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
  }
}
