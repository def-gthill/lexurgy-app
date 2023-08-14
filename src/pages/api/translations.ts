import { collectionEndpoint } from "@/api";
import Translation from "@/translation/Translation";
import {
  getTranslations,
  postTranslation,
} from "@/translation/translationEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | Translation[]>
) {
  await collectionEndpoint(req, res, getTranslations, postTranslation);
}
