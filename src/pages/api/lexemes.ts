import { collectionEndpoint } from "@/api";
import getDriver from "@/db";
import Lexeme from "@/lexicon/Lexeme";
import { getLexemes, postLexeme } from "@/lexicon/lexemeEndpoint";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lexeme | Lexeme[]>
) {
  await collectionEndpoint(req, res, getLexemes, postLexeme);
}
