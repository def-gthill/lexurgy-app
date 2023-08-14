import { resourceEndpoint } from "@/api";
import Glitch from "@/glitch/Glitch";
import { deleteGlitch, getGlitch } from "@/glitch/glitchEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Glitch | string>
) {
  await resourceEndpoint(req, res, getGlitch, deleteGlitch);
}
