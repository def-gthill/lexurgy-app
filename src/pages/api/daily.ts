import getDriver, { execute } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const driver = getDriver();
  await execute(driver, "MERGE (:Ping)");
  res.status(200).json("Pinged the database");
}
