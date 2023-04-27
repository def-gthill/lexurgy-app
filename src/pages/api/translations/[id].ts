import { resourceEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import Translation from "@/models/Translation";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | string>
) {
  await resourceEndpoint(req, res, getTranslation, deleteTranslation);
}

async function getTranslation(id: string): Promise<Translation[]> {
  return await query<Translation>(
    driver,
    `MATCH (tr:Translation {id: $id})
    OPTIONAL MATCH (tr) -[:IS_IN]-> (lang:Language)
    OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
    OPTIONAL MATCH (node) -[:HAS_TYPE]-> (cons:Construction)
    OPTIONAL MATCH (node) -[child:HAS_CHILD]-> (word:Word)
    OPTIONAL MATCH (word) -[:HAS_STEM]-> (lex:Lexeme)
    WITH tr, lang, node, cons,
    collect(
      [child.name, word {romanized: coalesce(lex.romanized, word.romanized), .stemId }]
    ) as children
    RETURN tr {
      .id,
      languageId: lang.id,
      .romanized,
      structure: node {nodeTypeId: cons.id, construction: cons {.*}, children: children},
      .translation
    }`,
    { id }
  );
}

async function deleteTranslation(id: string): Promise<Translation[]> {
  return await query<Translation>(
    driver,
    `MATCH (tr:Translation {id: $id})
    OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
    OPTIONAL MATCH (node) -[:HAS_CHILD]-> (word:Word)
    DETACH DELETE tr, node, word
    RETURN tr`,
    { id }
  );
}
