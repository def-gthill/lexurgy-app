import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import crypto from "crypto";
import { Neo4jError } from "neo4j-driver";
import { User } from "./User";

const driver = getDriver();

export async function postUser(user: User): Promise<User> {
  return await createOrRetrieveExistingUser(user);
}

export async function getUsers(requestQuery: RequestQuery): Promise<User[]> {
  const username = requestQuery.username as string;
  return await getUserArrayByUsername(username);
}

export async function getOrCreateUserByUsername(
  username: string
): Promise<User> {
  const newUser = {
    id: crypto.randomUUID(),
    username,
  };
  return await createOrRetrieveExistingUser(newUser);
}

async function createOrRetrieveExistingUser(user: User): Promise<User> {
  const existingUser = await getExistingUserByUsername(user.username);
  if (existingUser) {
    return existingUser;
  } else {
    try {
      await execute(driver, "CREATE (:User {id: $id, username: $username})", {
        ...user,
      });
      return user;
    } catch (error: unknown) {
      if (
        error instanceof Neo4jError &&
        error.code.endsWith("ConstraintValidationFailed")
      ) {
        // Oops, the user must've been created right after we checked.
        // Try the same dance again
        return await createOrRetrieveExistingUser(user);
      } else {
        throw error;
      }
    }
  }
}

async function getExistingUserByUsername(
  username: string
): Promise<User | null> {
  return (await getUserArrayByUsername(username))[0] ?? null;
}

async function getUserArrayByUsername(username: string): Promise<User[]> {
  return await query<User>(
    driver,
    "MATCH (user:User {username: $username}) return user",
    {
      username,
    }
  );
}
