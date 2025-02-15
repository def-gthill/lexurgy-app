import { RequestQuery } from "@/api";
import { removeDuplicates } from "@/array";
import getDriver, { execute, query } from "@/db";
import Lexeme from "@/lexicon/Lexeme";
import {
  FlatTranslation,
  flatten,
  inflate,
} from "@/translation/FlatTranslation";
import SyntaxNode, { structureToRomanized } from "@/translation/SyntaxNode";
import Translation from "@/translation/Translation";
import * as crypto from "crypto";

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
    RETURN node {.id, nodeTypeId: cons.id, construction: cons}
  } AS nodes
  RETURN {nodes: nodes, nodeLimbs: nodeLimbs, wordLimbs: wordLimbs} AS structure
}
RETURN tr {.id, languageId: lang.id, .romanized, flatStructure: structure, .translation}
`;

export async function postTranslation(
  translation: Translation
): Promise<Translation> {
  const driver = await getDriver();
  if (translation.id) {
    await deleteTranslation(translation.id);
  } else {
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
  CREATE (
    tr:Translation {
      id: $id,
      romanized: $romanized,
      translation: $translation
    }
  ) -[:IS_IN]-> (lang)
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
  const stems = removeDuplicates(getStems(structure));
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
  const driver = await getDriver();
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

export async function getTranslations(
  requestQuery: RequestQuery
): Promise<Translation[]> {
  const driver = await getDriver();
  const languageId = requestQuery.language as string;
  const result = (
    await query<FlatTranslation>(
      driver,
      `MATCH (tr:Translation) -[:IS_IN]-> (lang:Language {id: $id})
      ${translationQuery}`,
      { id: languageId }
    )
  ).map((flatTranslation) => {
    return repair(inflate(flatTranslation));
  });
  return result;
}

export async function getTranslation(id: string): Promise<Translation[]> {
  const driver = await getDriver();
  return (
    await query<FlatTranslation>(
      driver,
      `MATCH (tr:Translation {id: $id})
      OPTIONAL MATCH (tr) -[:IS_IN]-> (lang:Language)
      ${translationQuery}`,
      { id }
    )
  ).map((flatTranslation) => {
    return repair(inflate(flatTranslation));
  });
}

export function repair(translation: Translation): Translation {
  if (translation.structure) {
    const structure = translation.structure;
    return {
      ...translation,
      romanized: structureToRomanized(structure),
      structure,
    };
  } else {
    return {
      ...translation,
      structure: undefined,
    };
  }
}

export async function deleteTranslation(id: string): Promise<Translation[]> {
  const driver = await getDriver();
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
