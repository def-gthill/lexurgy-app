import { RequestQuery } from "@/api";
import getDriver, { query } from "@/db";
import FlatGlitch, { FlatDependent } from "@/glitch/FlatGlitch";
import Glitch, { Dependent } from "@/glitch/Glitch";
import { mapSaved } from "@/models/Saved";
import { inflate as inflateTranslation } from "@/translation/FlatTranslation";
import {
  repair as repairTranslation,
  translationQuery,
} from "@/translation/translationEndpoint";

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

export async function getGlitches(
  requestQuery: RequestQuery
): Promise<Glitch[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<Glitch>(
      driver,
      `MATCH (gl:Glitch) -[:IS_IN]-> (lang:Language {id: $id})
      ${glitchQuery}`,
      { id: languageId }
    )
  ).map(inflateGlitch);
  return result;
}

export async function getGlitch(id: string): Promise<Glitch[]> {
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

export async function deleteGlitch(id: string): Promise<Glitch[]> {
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
