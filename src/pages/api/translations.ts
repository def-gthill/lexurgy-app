import { RequestQuery, collectionEndpoint } from "@/api";
import getDriver, { execute, query } from "@/db";
import { FlatTranslation, flatten, inflate } from "@/models/FlatTranslation";
import Lexeme from "@/models/Lexeme";
import SyntaxNode, { structureToRomanized } from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { translationQuery } from "./translations/[id]";

const driver = getDriver();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Translation | Translation[]>
) {
  await collectionEndpoint(req, res, getTranslations, postTranslation);
}

async function getTranslations(
  requestQuery: RequestQuery
): Promise<Translation[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<FlatTranslation>(
      driver,
      `MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id})
      ${translationQuery}`,
      { id: languageId }
    )
  ).map((flatTranslation) => {
    const translation = inflate(flatTranslation);
    if (translation.structure) {
      const structure = translation.structure;
      return {
        ...translation,
        languageId,
        romanized: structureToRomanized(structure),
        structure,
      };
    } else {
      return {
        ...translation,
        languageId,
        structure: undefined,
      };
    }
  });
  return result;
}

async function postTranslation(translation: Translation): Promise<Translation> {
  if (translation.id === undefined) {
    translation.id = crypto.randomUUID();
  }
  if (translation.languageId && translation.structure) {
    translation.structure = await linkStems(
      translation.languageId,
      translation.structure
    );
  }
  if (translation.structure) {
    translation.romanized = structureToRomanized(translation.structure);
  }
  const flatTranslation = flatten(translation);
  const query = `
  MATCH (lang:Language {id: $languageId})
  MERGE (tr:Translation {id: $id}) -[:IS_IN]-> (lang)
  SET tr.romanized = $romanized, tr.translation = $translation
  WITH tr
  OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
  OPTIONAL MATCH (node) -[:HAS_CHILD]-> (word:Word)
  DETACH DELETE node, word
  WITH tr, $flatStructure AS structure
  WHERE structure IS NOT NULL
  CREATE (tr) -[:HAS_STRUCTURE]-> (:SyntaxNode {id: 0, ownerId: tr.id})
  WITH tr, structure
  CALL {
    WITH tr, structure
    UNWIND structure.nodes AS node
    MERGE (sn:SyntaxNode {id: node.id, ownerId: tr.id})
    WITH node, sn
    MATCH (cons:Construction {id: node.nodeTypeId})
    CREATE (sn) -[:HAS_TYPE]-> (cons)
  }
  CALL {
    WITH tr, structure
    UNWIND structure.nodeLimbs AS limb
    MATCH (parent:SyntaxNode {id: limb.parent, ownerId: tr.id})
    MATCH (child:SyntaxNode {id: limb.child, ownerId: tr.id})
    CREATE (parent) -[:HAS_CHILD {name: limb.childName}]-> (child)
  }
  CALL {
    WITH tr, structure
    UNWIND structure.wordLimbs AS limb
    MATCH (parent:SyntaxNode {id: limb.parent, ownerId: tr.id})
    CREATE (word:Word {romanized: limb.child.romanized})
    CREATE (parent) -[:HAS_CHILD {name: limb.childName}]-> (word)
    WITH word, limb.child.stemId AS stemId
    MATCH (lex:Lexeme {id: stemId})
    CREATE (word) -[:HAS_STEM]-> (lex)
  }
  `;
  await execute(driver, query, {
    ...flatTranslation,
    flatStructure: flatTranslation.flatStructure || null,
  });
  return translation;
}

async function linkStems(
  languageId: string,
  structure: SyntaxNode
): Promise<SyntaxNode> {
  const stems = getStems(structure);
  const stemToLexeme = await getLinkedLexemes(languageId, stems);
  const result = addLexemeLinks(structure, stemToLexeme);
  return result;
}

function getStems(structure: SyntaxNode): string[] {
  return structure.children.flatMap(([_name, child]) =>
    "romanized" in child ? [child.romanized] : getStems(child)
  );
}

async function getLinkedLexemes(
  languageId: string,
  stems: string[]
): Promise<Map<string, Lexeme>> {
  const linkedLexemes = await query<{ stem: string; lex: Lexeme }>(
    driver,
    `UNWIND $stems AS stem
    MATCH (lang:Language {id: $languageId})
    MATCH (lex:Lexeme {romanized: stem}) -[:IS_IN]-> (lang)
    WITH stem, collect(lex) AS lex
    WHERE size(lex) = 1
    RETURN stem, lex[0] AS lex;`,
    { languageId, stems }
  );
  return new Map(
    linkedLexemes.map(({ stem, lex }) => [stem, { ...lex, languageId }])
  );
}

function addLexemeLinks(
  structure: SyntaxNode,
  lexemes: Map<string, Lexeme>
): SyntaxNode {
  return {
    ...structure,
    children: structure.children.map(([childName, child]) => [
      childName,
      "romanized" in child
        ? { ...child, stemId: lexemes.get(child.romanized)?.id }
        : addLexemeLinks(child, lexemes),
    ]),
  };
}
