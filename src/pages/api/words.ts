import getDriver from "@/db";
import Word from "@/models/Word";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Word | Word[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (word:Word) -[:IS_IN]-> (lang:Language {id: $id}) RETURN word;",
        { id: languageId }
      );
      const words: Word[] = result.records.map((record) => ({
        id: record.get("word").properties.id as string,
        languageId,
        word: record.get("word").properties.word as string,
        pos: record.get("word").properties.pos as string,
        definitions: record.get("word").properties.definitions as string[],
      }));
      res.status(200).json(words);
    } finally {
      await session.close();
    }
  } else if (req.method === "POST") {
    const session = driver.session();
    const word = req.body as Word;
    if (word.id === undefined) {
      word.id = crypto.randomUUID();
    }
    try {
      await session.run(
        `MATCH (lang:Language {id: $languageId})
        CREATE (tr:Word {id: $id, word: $word, pos: $pos, definitions: $definitions})
        CREATE (tr) -[:IS_IN]-> (lang);`,
        word
      );
      res.status(201).json(word);
    } finally {
      await session.close();
    }
  }
}
