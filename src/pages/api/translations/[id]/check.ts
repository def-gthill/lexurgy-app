import getDriver, { execute } from "@/db";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const query = `
MATCH (tr:Translation {id: $id})
OPTIONAL MATCH (tr) -[:IS_IN]-> (lang:Language)
MATCH (tr) -[:HAS_STRUCTURE]-> (root:SyntaxNode)
MATCH path = (root) -[:HAS_CHILD*]-> (word:Word)
WHERE NOT (word) -[:HAS_STEM]-> (:Lexeme)
CREATE (gl:Glitch {
  id: randomUUID(),
  dependentType: 'Translation',
  dependentPartPath: (
    ['structure'] +
    reduce(
      limbs = [],
      limb IN relationships(path) | limbs + ['children', limb.name]
    ) +
    ['stem']
  ),
  referentType: 'Lexeme',
  referentIsId: false,
  referentKey: word.romanized,
  referentPartPath: []
})
CREATE (gl) -[:WAS_FOUND_IN]-> (tr)
CREATE (gl) -[:IS_IN]-> (lang)
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const driver = await getDriver();
  if (req.method === "POST") {
    const { id } = req.query;
    if (typeof id !== "string") {
      res.status(HttpStatusCode.BadRequest).json('Parameter "id" not set');
    }
    await execute(driver, query, { id });
    res.status(HttpStatusCode.Accepted).send("");
  } else {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", "POST")
      .send("");
  }
}
