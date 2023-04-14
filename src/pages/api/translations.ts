import getDriver from "@/db";
import Translation from "@/models/Translation";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | Translation[]>
) {
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id})
        OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
        OPTIONAL MATCH (node) -[:HAS_TYPE]-> (cons:Construction)
        OPTIONAL MATCH (node) -[child:HAS_CHILD]-> (word:Word)
        WITH tr, node, cons, collect([child.name, word {.*}]) as children
        RETURN tr {.id, .romanized, structure: node {nodeTypeId: cons.id, children: children}, .translation}`,
        { id: languageId }
      );
      const translations: Translation[] = result.records.map((record) => {
        const properties = record.get("tr");
        const result = {
          id: properties.id as string,
          languageId,
          romanized: properties.romanized as string,
          translation: properties.translation as string,
        };
        if (properties.structure) {
          return {
            ...result,
            structure: {
              ...properties.structure,
              children: Object.fromEntries(properties.structure.children),
            },
          };
        } else {
          return result;
        }
      });
      res.status(200).json(translations);
    } finally {
      await session.close();
    }
  } else if (req.method === "POST") {
    const session = driver.session();
    const translation = req.body as Translation;
    if (translation.id === undefined) {
      translation.id = crypto.randomUUID();
    }
    try {
      let query = `
      MATCH (lang:Language {id: $languageId})
      CREATE (tr:Translation {id: $id, romanized: $romanized, translation: $translation})
      CREATE (tr) -[:IS_IN]-> (lang)`;
      if (translation.structure) {
        query += `
        CREATE (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
        WITH node
        MATCH (cons:Construction {id: $structure.nodeTypeId})
        CREATE (node) -[:HAS_TYPE]-> (cons)
        WITH node
        UNWIND [k in KEYS($structure.children) | [k, $structure.children[k]]] AS child
        CREATE (word:Word {romanized: child[1].romanized})
        CREATE (node) -[:HAS_CHILD {name: child[0]}]-> (word)`;
      }
      await session.run(query, translation);
      res.status(201).json(translation);
    } finally {
      await session.close();
    }
  }
}
