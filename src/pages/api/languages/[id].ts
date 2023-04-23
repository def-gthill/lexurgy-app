import getDriver, { query } from "@/db";
import Language from "@/models/Language";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | string>
) {
  const { id } = req.query;
  if (req.method === "GET") {
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
  } else if (req.method == "DELETE") {
    const language = await query<Language>(
      driver,
      `MATCH (lang:Language {id: $id})
      OPTIONAL MATCH (lang) <-[:IS_IN]- (n)
      DETACH DELETE lang, n RETURN lang`,
      { id }
    );
    res.status(HttpStatusCode.Ok).json(`Language ${language} deleted`);
  } else {
    res.status(HttpStatusCode.MethodNotAllowed);
  }
}
