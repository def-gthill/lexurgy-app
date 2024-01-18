import { collectionEndpoint } from "@/api";
import { SavedWorld } from "@/world/World";
import { getWorlds, postWorld } from "@/world/worldEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavedWorld | SavedWorld[]>
) {
  await collectionEndpoint(req, res, getWorlds, postWorld);
}
