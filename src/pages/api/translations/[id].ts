import { resourceEndpoint } from "@/api";
import Translation from "@/translation/Translation";
import {
  deleteTranslation,
  getTranslation,
} from "@/translation/translationEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | string>
) {
  await resourceEndpoint(req, res, getTranslation, deleteTranslation);
}
