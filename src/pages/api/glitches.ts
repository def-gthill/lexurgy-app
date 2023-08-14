import { collectionEndpoint } from "@/api";
import Glitch from "@/glitch/Glitch";
import { getGlitches } from "@/glitch/glitchEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Glitch[]>
) {
  await collectionEndpoint(req, res, getGlitches);
}
