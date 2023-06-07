import { resourceEndpoint } from "@/api";
import Language from "@/language/Language";
import { deleteLanguage, getLanguage } from "@/language/languageEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Language | string>
) {
  await resourceEndpoint(req, res, getLanguage, deleteLanguage);
}
