import { resourceEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import { FlatTranslation, inflate } from "@/models/FlatTranslation";
import { structureToRomanized } from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export const translationQuery = `
OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (root:SyntaxNode)
WITH tr, root, lang
CALL {
  WITH root
  OPTIONAL MATCH (root) -[:HAS_CHILD*]-> (node:SyntaxNode)
  WITH root, [root] + collect(node) AS nodes
  WITH
  COLLECT {
    UNWIND nodes AS parent
    MATCH (parent) -[limb:HAS_CHILD]-> (child:SyntaxNode)
    WITH {parent: parent.id, childName: limb.name, child: child.id} AS limb
    RETURN limb
  } AS nodeLimbs,
  COLLECT {
    UNWIND nodes AS parent
    MATCH (parent) -[limb:HAS_CHILD]-> (word:Word)
    OPTIONAL MATCH (word) -[:HAS_STEM]-> (lex:Lexeme)
    WITH {
      parent: parent.id,
      childName: limb.name,
      child: word {romanized: coalesce(lex.romanized, word.romanized), stemId: lex.id}
    } AS limb
    RETURN limb
  } AS wordLimbs,
  COLLECT {
    UNWIND nodes as node
    OPTIONAL MATCH (node) -[:HAS_TYPE]-> (cons:Construction)
    RETURN node {.id, nodeTypeId: cons.id, construction: cons {.*}}
  } AS nodes
  RETURN {nodes: nodes, nodeLimbs: nodeLimbs, wordLimbs: wordLimbs} AS structure
}
RETURN tr {.id, languageId: lang.id, .romanized, flatStructure: structure, .translation}
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | string>
) {
  await resourceEndpoint(req, res, getTranslation, deleteTranslation);
}

async function getTranslation(id: string): Promise<Translation[]> {
  return (
    await query<FlatTranslation>(
      driver,
      `MATCH (tr:Translation {id: $id})
      OPTIONAL MATCH (tr) -[:IS_IN]-> (lang:Language)
      ${translationQuery}`,
      { id }
    )
  ).map((flatTranslation) => {
    const translation = inflate(flatTranslation);
    if (translation.structure) {
      const structure = translation.structure;
      return {
        ...translation,
        romanized: structureToRomanized(structure),
        structure,
      };
    } else {
      return translation;
    }
  });
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
