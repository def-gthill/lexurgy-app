import { collectionEndpoint } from "@/api";
import getDriver from "@/db";
import { SavedLexeme } from "@/lexicon/Lexeme";
import { getLexemes, postLexeme } from "@/lexicon/lexemeEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavedLexeme | SavedLexeme[]>
) {
  await collectionEndpoint(req, res, getLexemes, postLexeme);
}
