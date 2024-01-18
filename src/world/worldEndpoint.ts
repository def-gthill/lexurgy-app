import { RequestQuery, addId } from "@/api";
import getDriver, { execute, query } from "@/db";
import World, { SavedWorld } from "@/world/World";

const driver = getDriver();

export async function postWorld(
  world: World,
  userId: string
): Promise<SavedWorld> {
  const savedWorld = addId(world);
  await execute(
    driver,
    `MERGE (world: World {id: $id})
    SET world.name = $name, world.description = $description
    WITH world
    MATCH (user:User {id: $userId})
    CREATE (user) -[:OWNS]-> (world)`,
    {
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
  return await query<SavedWorld>(
    driver,
    "MATCH (user:User {id: $userId}) -[:OWNS]-> (world: World) RETURN world;",
    { userId }
  );
}

export async function getWorld(
  id: string,
  userId: string
): Promise<SavedWorld[]> {
  return await query<SavedWorld>(
    driver,
    "MATCH (user:User {id: $userId}) -[:OWNS]-> (world:World {id: $id}) RETURN world;",
    { id, userId }
  );
}

export async function deleteWorld(
  id: string,
  userId: string
): Promise<SavedWorld[]> {
  return await query<SavedWorld>(
    driver,
    `MATCH (user:User {id: $userId}) -[:OWNS]-> (world:World {id: $id})
    OPTIONAL MATCH (world) <-[:IS_IN]- (n)
    DETACH DELETE world, n RETURN world`,
    { id, userId }
  );
}
