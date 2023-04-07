import { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URL || "",
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || "",
    process.env.NEO4J_PASSWORD || ""
  )
);

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
