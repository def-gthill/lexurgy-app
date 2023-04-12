import getDriver from "@/db";
import Construction from "@/models/Construction";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Construction[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (cons:Construction) -[:IS_IN]-> (lang:Language {id: $id}) RETURN cons;",
        { id: languageId }
      );
      const constructions: Construction[] = result.records.map((record) => ({
        id: record.get("cons").properties.id as string,
        languageId,
        name: record.get("cons").properties.name as string,
        children: record.get("cons").properties.children as string[],
      }));
      res.status(200).json(constructions);
    } finally {
      await session.close();
    }
  }
}
