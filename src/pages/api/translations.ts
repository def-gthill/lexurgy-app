import getDriver from "@/db";
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
  if (req.method === "GET") {
    const languageId = req.query.language as string;
    const session = driver.session();
    try {
      const result = await session.run(
        `MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id})
        OPTIONAL MATCH (tr) -[:HAS_STRUCTURE]-> (node:SyntaxNode)
        OPTIONAL MATCH (node) -[:HAS_TYPE]-> (cons:Construction)
        OPTIONAL MATCH (node) -[child:HAS_CHILD]-> (word:Word)
        OPTIONAL MATCH (word) -[:HAS_STEM]-> (lex:Lexeme)
        WITH tr, node, cons, collect([child.name, word {romanized: coalesce(lex.romanized, word.romanized), .stemId }]) as children
        RETURN tr {.id, .romanized, structure: node {nodeTypeId: cons.id, construction: cons {.*}, children: children}, .translation}`,
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
          const structure = {
            ...properties.structure,
            children: Object.fromEntries(properties.structure.children),
          };
          return {
            ...result,
            romanized: structureToRomanized(structure),
            structure,
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
    if (translation.languageId && translation.structure) {
      translation.structure = await linkStems(
        translation.languageId,
        translation.structure
      );
    }
    if (translation.structure) {
      translation.romanized = structureToRomanized(translation.structure);
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
        CREATE (node) -[:HAS_CHILD {name: child[0]}]-> (word)
        WITH word, child[1].stemId AS stemId
        MATCH (lex:Lexeme {id: stemId})
        CREATE (word) -[:HAS_STEM]-> (lex)`;
      }
      await session.run(query, translation);
      res.status(201).json(translation);
    } finally {
      await session.close();
    }
  }
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
  return Object.values(structure.children).flatMap((child) =>
    "romanized" in child ? [child.romanized] : getStems(child)
  );
}

async function getLinkedLexemes(
  languageId: string,
  stems: string[]
): Promise<Map<string, Lexeme>> {
  const session = driver.session();
  try {
    const result = await session.run(
      `UNWIND $stems AS stem
      MATCH (lang:Language {id: $languageId})
      MATCH (lex:Lexeme {romanized: stem}) -[:IS_IN]-> (lang)
      WITH stem, collect(lex) AS lex
      WHERE size(lex) = 1
      RETURN stem, lex[0] AS lex;`,
      { languageId, stems }
    );
    const lexemes: Map<string, Lexeme> = new Map(
      result.records.map((record) => [
        record.get("stem"),
        {
          id: record.get("lex").properties.id as string,
          languageId,
          romanized: record.get("lex").properties.romanized as string,
          pos: record.get("lex").properties.pos as string,
          definitions: record.get("lex").properties.definitions as string[],
        },
      ])
    );
    return lexemes;
  } finally {
    await session.close();
  }
}

function addLexemeLinks(
  structure: SyntaxNode,
  lexemes: Map<string, Lexeme>
): SyntaxNode {
  return {
    ...structure,
    children: Object.fromEntries(
      Object.entries(structure.children).map(([childName, child]) => [
        childName,
        "romanized" in child
          ? { ...child, stemId: lexemes.get(child.romanized)?.id }
          : addLexemeLinks(child, lexemes),
      ])
    ),
  };
}
