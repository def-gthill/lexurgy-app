import { collectionEndpoint } from "@/api";
import Evolution from "@/sc/Evolution";
import { getEvolutions, postEvolution } from "@/sc/scEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Evolution | Evolution[]>
) {
  await collectionEndpoint(req, res, getEvolutions, postEvolution);
}
