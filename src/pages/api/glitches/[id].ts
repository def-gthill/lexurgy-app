import { resourceEndpoint } from "@/api";
import getDriver, { query } from "@/db";
import Glitch from "@/models/Glitch";
import { NextApiRequest, NextApiResponse } from "next";

const driver = getDriver();

export const glitchQuery = `
MATCH (gl) -[:WAS_FOUND_IN]-> (dependent)
RETURN {
  id: gl.id,
  dependent: {
    type: gl.dependentType,
    value: dependent,
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
  return await query<Glitch>(
    driver,
    `MATCH (gl:Glitch {id: $id})
    OPTIONAL MATCH (gl) -[:IS_IN]-> (lang:Language)
    ${glitchQuery}`,
    { id }
  );
}

async function deleteGlitch(id: string): Promise<Glitch[]> {
  return await query<Glitch>(
    driver,
    `MATCH (gl:Glitch {id: $id})
    DETACH DELETE gl RETURN gl`,
    { id }
  );
}
