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
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language[]>
) {
  if (req.method === "GET") {
    const session = driver.session();
    try {
      const result = await session.run("MATCH (lang:Language) RETURN lang;");
      const languages = result.records.map((record) => ({
        name: record.get("lang").properties.name,
      }));
      res.status(200).json(languages);
    } finally {
      await session.close();
    }
  }
}
