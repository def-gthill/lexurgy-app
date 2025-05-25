import { RequestQuery, addId } from "@/api";
import getDriver, { execute, query } from "@/db";
import World, { SavedWorld } from "@/world/World";

export async function postWorld(
  world: World,
  userId: string
): Promise<SavedWorld> {
  const driver = await getDriver();
  const savedWorld = addId(world);
  await execute(
    driver,
    `MATCH (user:User {id: $userId})
    MERGE (user) -[:OWNS]-> (world: World {id: $id})
    SET world.name = $name, world.description = $description, world.isExample = $isExample`,
    {
      isExample: false,
      ...savedWorld,
      userId,
    }
  );
  return savedWorld;
}

export async function getWorlds(
  _requestQuery: RequestQuery,
  userId: string
): Promise<SavedWorld[]> {
  const driver = await getDriver();
  return await query<SavedWorld>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (world: World)
    OPTIONAL MATCH (world) <-[:IS_IN]- (language: Language)
    WITH world, count(language) as numLanguages
    RETURN world { .*, numLanguages: numLanguages };`,
    { userId }
  );
}

export async function getWorld(
  id: string,
  userId: string
): Promise<SavedWorld[]> {
  const driver = await getDriver();
  return await query<SavedWorld>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (world:World {id: $id})
    OPTIONAL MATCH (world) <-[:IS_IN]- (language: Language)
    WITH world, count(language) as numLanguages
    RETURN world { .*, numLanguages: numLanguages };`,
    { id, userId }
  );
}

export async function deleteWorld(
  id: string,
  userId: string
): Promise<SavedWorld[]> {
  const driver = await getDriver();
  return await query<SavedWorld>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (world:World {id: $id})
    OPTIONAL MATCH (world) <-[:IS_IN]- (n)
    DETACH DELETE world, n RETURN world`,
    { id, userId }
  );
}
