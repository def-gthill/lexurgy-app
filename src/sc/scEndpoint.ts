import { RequestQuery, addId } from "@/api";
import getDriver, { execute, query } from "@/db";
import { RequiredKeys } from "@/models/RequiredKeys";
import Evolution, {
  EvolutionWithLanguageId,
  SavedEvolution,
} from "@/sc/Evolution";

const driver = getDriver();
export async function getEvolutions(
  requestQuery: RequestQuery
): Promise<SavedEvolution[]> {
  const languageId = requestQuery.language as string;
  const result = (
    await query<RequiredKeys<Evolution, "id">>(
      driver,
      "MATCH (ev:Evolution) -[:IS_IN]-> (lang:Language {id: $id}) RETURN ev;",
      { id: languageId }
    )
  ).map((evolution) => ({ ...evolution, languageId }));
  return result;
}

export async function postEvolution(
  evolution: EvolutionWithLanguageId
): Promise<SavedEvolution> {
  const evolutionWithId = addId(evolution);
  await execute(
    driver,
    `MATCH (lang:Language {id: $languageId})
    MERGE (ev:Evolution {id: $id}) -[:IS_IN]-> (lang)
    SET ev.soundChanges = $soundChanges, ev.testWords = $testWords`,
    { ...evolutionWithId }
  );
  return evolutionWithId;
}
