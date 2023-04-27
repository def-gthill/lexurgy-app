import { RequestQuery, collectionEndpoint } from "@/api";
import getDriver, { execute, query } from "@/db";
import { flatten } from "@/models/FlatSyntaxNode";
import Lexeme from "@/models/Lexeme";
import SyntaxNode, { structureToRomanized } from "@/models/SyntaxNode";
import Translation from "@/models/Translation";
import * as crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

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
    await query<Translation>(
      driver,
      `MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id})
      OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
      OPTIONAL MATCH (node) -[:HAS_TYPE]-> (cons:Construction)
      OPTIONAL MATCH (node) -[child:HAS_CHILD]-> (word:Word)
      OPTIONAL MATCH (word) -[:HAS_STEM]-> (lex:Lexeme)
      WITH tr, node, cons, collect([child.name, word {romanized: coalesce(lex.romanized, word.romanized), .stemId }]) as children
      RETURN tr {.id, .romanized, structure: node {nodeTypeId: cons.id, construction: cons {.*}, children: children}, .translation}`,
      { id: languageId }
    )
  ).map((translation) => {
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
  let query = `
  MATCH (lang:Language {id: $languageId})
  MERGE (tr:Translation {id: $id}) -[:IS_IN]-> (lang)
  SET tr.romanized = $romanized, tr.translation = $translation
  WITH tr
  OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
  OPTIONAL MATCH (node) -[:HAS_CHILD]-> (word:Word)
  DETACH DELETE node, word`;
  if (translation.structure) {
    query += `
    WITH tr
    CREATE (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
    WITH node
    MATCH (cons:Construction {id: $structure.nodeTypeId})
    CREATE (node) -[:HAS_TYPE]-> (cons)
    WITH node
    UNWIND $structure.children AS child
    CREATE (word:Word {romanized: child[1].romanized})
    CREATE (node) -[:HAS_CHILD {name: child[0]}]-> (word)
    WITH word, child[1].stemId AS stemId
    MATCH (lex:Lexeme {id: stemId})
    CREATE (word) -[:HAS_STEM]-> (lex)`;
  }
  await execute(driver, query, { ...translation });
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
