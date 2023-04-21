import getDriver, { query } from "@/db";
import Construction from "@/models/Construction";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Construction[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const result = (
      await query<Construction>(
        driver,
        "MATCH (cons:Construction) -[:IS_IN]-> (lang:Language {id: $id}) RETURN cons;",
        { id: languageId }
      )
    ).map((construction) => ({ ...construction, languageId }));
    res.status(200).json(result);
  }
}
