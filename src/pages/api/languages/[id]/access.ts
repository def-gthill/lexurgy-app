import { collectionEndpoint } from "@/api";
import LanguageAccess from "@/language/LanguageAccess";
import {
  getLanguageAccess,
  postLanguageAccess,
} from "@/language/languageAccessEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LanguageAccess | LanguageAccess[]>
) {
  await collectionEndpoint(req, res, getLanguageAccess, postLanguageAccess);
}
