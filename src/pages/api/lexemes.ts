import { collectionEndpoint } from "@/api";
import { SavedLexeme } from "@/lexicon/Lexeme";
import { getLexemes, postLexeme } from "@/lexicon/lexemeEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavedLexeme | SavedLexeme[]>
) {
  await collectionEndpoint(req, res, getLexemes, postLexeme);
}
