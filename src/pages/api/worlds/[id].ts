import { resourceEndpoint } from "@/api";
import World from "@/world/World";
import { deleteWorld, getWorld } from "@/world/worldEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<World | string>
) {
  await resourceEndpoint(req, res, getWorld, deleteWorld);
}
