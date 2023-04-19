import getDriver from "@/db";
import Lexeme from "@/models/Lexeme";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Lexeme | Lexeme[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (lex:Lexeme) -[:IS_IN]-> (lang:Language {id: $id}) RETURN lex;",
        { id: languageId }
      );
      const lexemes: Lexeme[] = result.records.map((record) => ({
        id: record.get("lex").properties.id as string,
        languageId,
        romanized: record.get("lex").properties.romanized as string,
        pos: record.get("lex").properties.pos as string,
        definitions: record.get("lex").properties.definitions as string[],
      }));
      res.status(200).json(lexemes);
    } finally {
      await session.close();
    }
  } else if (req.method === "POST") {
    const session = driver.session();
    const lexeme = req.body as Lexeme;
    if (lexeme.id === undefined) {
      lexeme.id = crypto.randomUUID();
    }
    try {
      await session.run(
        `MATCH (lang:Language {id: $languageId})
        MERGE (lex:Lexeme {id: $id}) -[:IS_IN]-> (lang)
        SET lex.romanized = $romanized, lex.pos = $pos, lex.definitions = $definitions`,
        lexeme
      );
      res.status(201).json(lexeme);
    } finally {
      await session.close();
    }
  }
}
