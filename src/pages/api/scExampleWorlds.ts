import { getScExampleWorlds } from "@/sc/scExampleWorldEndpoint";
import { SavedWorld } from "@/world/World";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavedWorld[]>
) {
  return await getScExampleWorlds(req, res);
}
