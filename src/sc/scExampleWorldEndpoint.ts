import getDriver, { query } from "@/db";
import ScExampleWorld from "@/sc/ScExampleWorld";
import { HttpStatusCode } from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export async function getScExampleWorlds(
  req: NextApiRequest,
  res: NextApiResponse<ScExampleWorld[]>
) {
  if (req.method === "GET") {
    const result = (
      await query<ScExampleWorld>(
        driver,
        `
        MATCH (world: World {isExample: true}) <-[:IS_IN]- (lang: Language) <-[:IS_IN]- (ev: Evolution)
        WITH world, lang{.*, evolution: ev} AS lang
        WITH world, collect(lang) AS langs
        RETURN world{.*, languages: langs}
        `
      )
    ).map((world) => ({
      ...world,
      languages: world.languages.map((language) => ({
        ...language,
        evolution: { ...language.evolution, languageId: language.id },
      })),
    }));
    res.status(HttpStatusCode.Ok).json(result);
  } else {
    res
      .status(HttpStatusCode.MethodNotAllowed)
      .setHeader("allow", "GET")
      .json([]);
  }
}
