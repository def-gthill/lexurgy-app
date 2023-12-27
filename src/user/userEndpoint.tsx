import { RequestQuery } from "@/api";
import getDriver, { execute, query } from "@/db";
import crypto from "crypto";
import { User } from "./User";

const driver = getDriver();

export async function postUser(user: User): Promise<User> {
  let existingUser = (
    await query<User>(
      driver,
      "MATCH (user:User {username: $username}) return user",
      {
        username: user.username,
      }
    )
  )[0];
  if (existingUser) {
    return existingUser;
  } else {
    await execute(driver, "CREATE (:User {id: $id, username: $username})", {
      ...user,
    });
    return user;
  }
}

export async function getUsers(requestQuery: RequestQuery): Promise<User[]> {
  const username = requestQuery.username as string;
  const result = await query<User>(
    driver,
    "MATCH (user:User {username: $username}) return user",
    {
      username,
    }
  );
  return result;
}

export async function getOrCreateUserByUsername(
  username: string
): Promise<User> {
  let user = (
    await query<User>(
      driver,
      "MATCH (user:User {username: $username}) return user",
      {
        username,
      }
    )
  )[0];
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      username,
    };
    await execute(driver, "CREATE (:User {id: $id, username: $username})", {
      ...user,
    });
  }
  return user;
}
