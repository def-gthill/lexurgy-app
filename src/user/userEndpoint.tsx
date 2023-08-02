import getDriver, { execute, query } from "@/db";
import crypto from "crypto";
import { User } from "./User";

const driver = getDriver();

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
