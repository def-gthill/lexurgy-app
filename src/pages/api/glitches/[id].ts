import { resourceEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import FlatGlitch, { FlatDependent } from "@/models/FlatGlitch";
import { inflate as inflateTranslation } from "@/models/FlatTranslation";
import Glitch, { Dependent } from "@/models/Glitch";
import { mapSaved } from "@/models/Saved";
import { NextApiRequest, NextApiResponse } from "next";
import {
  repair as repairTranslation,
  translationQuery,
} from "../translations/[id]";

const driver = getDriver();

export const glitchQuery = `
OPTIONAL MATCH (gl) -[:WAS_FOUND_IN]-> (tr:Translation)
CALL {
  WITH tr, lang
  ${translationQuery}
  AS dependentTr
}
MATCH (gl) -[:WAS_FOUND_IN]-> (dependent)
RETURN {
  id: gl.id,
  languageId: lang.id,
  dependent: {
    type: gl.dependentType,
    value: coalesce(dependentTr, dependent),
    invalidPartPath: gl.dependentPartPath
  },
  referent: {
    referenceType: 'Undefined',
    type: gl.referentType,
    searchTerm: gl.referentKey
  }
}
`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Glitch | string>
) {
  await resourceEndpoint(req, res, getGlitch, deleteGlitch);
}

async function getGlitch(id: string): Promise<Glitch[]> {
  return (
    await query<FlatGlitch>(
      driver,
      `MATCH (gl:Glitch {id: $id})
      OPTIONAL MATCH (gl) -[:IS_IN]-> (lang:Language)
      ${glitchQuery}`,
      { id }
    )
  ).map(inflateGlitch);
}

async function deleteGlitch(id: string): Promise<Glitch[]> {
  return await query<Glitch>(
    driver,
    `MATCH (gl:Glitch {id: $id})
    DETACH DELETE gl RETURN gl`,
    { id }
  );
}

export function inflateGlitch(glitch: FlatGlitch): Glitch {
  return {
    ...glitch,
    dependent: inflateDependent(glitch.dependent),
  };
}

function inflateDependent(dependent: FlatDependent): Dependent {
  switch (dependent.type) {
    case "Translation":
      return {
        ...dependent,
        value: mapSaved(dependent.value, (value) =>
          repairTranslation(inflateTranslation(value))
        ),
      };
    default:
      return dependent;
  }
}
