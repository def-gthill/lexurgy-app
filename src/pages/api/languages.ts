import { collectionEndpoint } from "@/api";
import Language from "@/language/Language";
import { getLanguages, postLanguage } from "@/language/languageEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | Language[]>
) {
  await collectionEndpoint(req, res, getLanguages, postLanguage);
}
