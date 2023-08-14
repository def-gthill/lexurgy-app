import { collectionEndpoint } from "@/api";
import Construction from "@/syntax/Construction";
import {
  getConstructions,
  postConstruction,
} from "@/syntax/constructionEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Construction | Construction[]>
) {
  await collectionEndpoint(req, res, getConstructions, postConstruction);
}
